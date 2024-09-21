import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import Loading from "../Loading/Loading";
import bme from "../../Assets/bookmyevent.png";
import { storage } from "../../auth/firebase";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { compress } from "image-conversion";

import "./form.css";

export default function Form({ formType, eventData }) {
  const user = useSelector((store) => store.user);
  const navigate = useNavigate();

  // Loading state
  const [loading, setLoading] = useState(true);

  // Event details
  const [event, setEvent] = useState({ ...eventData });

  // List of blocked Venues
  const [block, setBlock] = useState([]);

  // Today's date
  const [todayDate, setTodayDate] = useState("");

  // Ref for form
  const formBody = useRef();

  // Alert Information State
  const [alert, setAlert] = useState({
    type: "info",
    info: "Enter the Date and Session",
  });

  // Disable/Enable input fields
  const [disable, setDisable] = useState(formType === "Edit" ? false : true);

  // const venues = [
  //   "CHOOSE A VENUE---",
  //   "MULTI PURPOSE HALL",
  //   "FUNCTION HALL",
  //   "VIDEO HALL",
  //   "LIBRARY SEMINAR HALL",
  //   "BIO TECH SEMINAR HALL",
  //   "LIBRARY CONFERENCE HALL",
  //   "OTHERS**",
  // ];

  // List of Venues

  const venues = [
    "CHOOSE A VENUE---",
    "LIBRARY SEMINAR HALL",
    "BIO TECH SEMINAR HALL",
    "LIBRARY CONFERENCE HALL",
    "OTHERS**",
  ];

  // Sessions
  const sessions = ["FN", "AN", "EVNG", "Full Day"];

  // Timings for each Session
  const tsessions = [
    "9:00 AM-12:00 PM",
    "01:00 PM-04:00 PM",
    "04:00 PM-08:00 PM",
    "Full Day",
  ];

  // To Fetch Today Date and Time
  async function fetchTodayDate() {
    // API Call to get accurate IST
    const res = await fetch(
      "https://worldtimeapi.org/api/timezone/Asia/Kolkata"
    );
    const data = await res.json();

    // Date Format ->  YYYY-MM-DD
    setTodayDate(new Date(data["datetime"]).toISOString().slice(0, 10));
  }

  // Fetch the Blocked Venues for Given Date & Session
  async function fetchBlockDates(date, session) {
    if (date != "" && session != "") {
      // Temporarily disable all the input fields till the blocked venues is fetched
      setDisable(true);

      // Fetch the blocked Venues from Server
      const result = await fetch(
        "https://bookmyeventserver.vercel.app/api/checkDate",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            date: date,
            session: session,
          }),
        }
      );
      const data = await result.json();

      /*
        Format -> {
                    blocked : [
                                [event_id,event_venue],
                                ...
                            ]
                }

    */

      // Update the blocked venue state
      let blocked_venue_with_id = data.blocked;
      let blocked_venues = [];

      // Exclude the booked venue from Block list
      if (formType === "Edit") {
        blocked_venue_with_id = blocked_venue_with_id.filter(
          (item) => event._id != item[0]
        );
      }

      blocked_venues = blocked_venue_with_id.map((item) => item[1]);

      setBlock(blocked_venues);

      if (blocked_venues.length === 6) {
        setAlert({
          type: "warning",
          info: "Oops! All venues are full.You can use either your Department or others",
        });
      }
      setAlert({
        type: "success",
        info: "Venues are available",
      });

      // Unfreeze all the input fields
      setDisable(false);
    }
  }

  // Invokes when date/session field changes
  function checkDate(evt) {
    if (evt.target.type === "date") {
      setEvent({ ...event, date: evt.target.value });
      fetchBlockDates(evt.target.value, event.session);
    } else {
      setEvent({ ...event, session: evt.target.value });
      fetchBlockDates(event.date, evt.target.value);
    }
  }

  // Invokes when error occurs
  function generateDangerAlert(info) {
    setAlert({
      type: "danger",
      info: info,
    });
    formBody.current.scrollIntoView();
  }

  // Validate all the field values
  async function validateData(evt) {
    evt.preventDefault();

    if (event.audience === 0) {
      generateDangerAlert("Enter the audience limit");
      return;
    }

    if (event.venue === "" || event.venue === "CHOOSE A VENUE---") {
      generateDangerAlert("Enter the venue");
      return;
    }

    switch (event.venue) {
      case "LIBRARY CONFERENCE HALL":
        if (event.audience > 25) {
          generateDangerAlert("Maximum Allowed Occupancy - 25");
          return;
        }
        break;

      case "BIO TECH SEMINAR HALL": // Upto 80
        if (event.audience > 80) {
          generateDangerAlert("Maximum Allowed Occupancy - 80");
          return;
        }
        break;

      case "LIBRARY SEMINAR HALL": //Upto 80
        if (event.audience > 80) {
          generateDangerAlert("Maximum Allowed Occupancy - 80");
          return;
        }
        break;

      case "VIDEO HALL": //Upto 120
        if (event.audience <= 80 && !block.includes("BIO TECH SEMINAR HALL")) {
          generateDangerAlert("Bio-tech Seminar Hall is Available");
          return;
        }
        if (event.audience <= 80 && !block.includes("LIBRARY SEMINAR HALL")) {
          generateDangerAlert("Library Seminar Hall is Available");
          return;
        }
        if (event.audience > 120) {
          generateDangerAlert("Maximum Allowed Occupancy - 120");
          return;
        }
        break;

      case "FUNCTION HALL": // Upto 240
        if (event.audience <= 80 && !block.includes("BIO TECH SEMINAR HALL")) {
          generateDangerAlert("Bio-tech Seminar Hall is Available");
          return;
        }

        if (event.audience <= 80 && !block.includes("LIBRARY SEMINAR HALL")) {
          generateDangerAlert("Library Seminar Hall is Available");
          return;
        }

        if (event.audience <= 120 && !block.includes("VIDEO HALL")) {
          generateDangerAlert("Video Hall is Available");
          return;
        }

        if (event.audience > 240) {
          generateDangerAlert("Maximum Allowed occupancies - 240");
          return;
        }

        break;

      case "MULTI PURPOSE HALL":
        if (event.audience <= 80 && !block.includes("BIO TECH SEMINAR HALL")) {
          generateDangerAlert("Bio-tech Seminar Hall is Available");
          return;
        }

        if (event.audience <= 80 && !block.includes("LIBRARY SEMINAR HALL")) {
          generateDangerAlert("Library Seminar Hall is Available");
          return;
        }

        if (event.audience <= 120 && !block.includes("VIDEO HALL")) {
          generateDangerAlert("Video Hall is Available");
          return;
        }

        if (event.audience <= 240 && !block.includes("FUNCTION HALL")) {
          generateDangerAlert("Function Hall is Available");
          return;
        }
        break;

      case "OTHERS**":
        if (event.venueName.trim() === "") {
          generateDangerAlert("Enter the Venue");
          return;
        }
        break;
    }

    if (event.event.trim() === "") {
      generateDangerAlert("Enter the Event Name");
      return;
    }
    if (event.image === "") {
      generateDangerAlert("Upload the Event Image");
      return;
    }
    if (event.description.trim() === "") {
      generateDangerAlert("Enter the Description");
      return;
    }
    if (event.startTime.trim() === "") {
      generateDangerAlert("Enter the Event Start Time");
      return;
    }
    if (event.endTime.trim() === "") {
      generateDangerAlert("Enter the Event End Time");
      return;
    }

    switch (event.session) {
      case "FN":
        if (
          (Number(event.endTime.split(":")[0]) === 12 &&
            Number(event.endTime.split(":")[1]) > 0) ||
          Number(event.endTime.split(":")[0]) > 12
        ) {
          generateDangerAlert("Program should end by 12:00 PM");
          return;
        }
        break;
      case "AN":
        if (Number(event.startTime.split(":")[0]) < 13) {
          generateDangerAlert("Program should start from atleast 1:00 PM");
          return;
        }

        if (
          (Number(event.endTime.split(":")[0]) === 16 &&
            Number(event.endTime.split(":")[1]) > 0) ||
          Number(event.endTime.split(":")[0]) > 16
        ) {
          generateDangerAlert("Program should end by 04:00 PM");
          return;
        }

        break;

      case "EVNG":
        if (Number(event.startTime.split(":")[0]) < 16) {
          generateDangerAlert("Program should start from atleast 4:00 PM");
          return;
        }
        break;
    }
    if (
      Number(event.startTime.split(":")[0]) >
      Number(event.endTime.split(":")[0])
    ) {
      generateDangerAlert("Invalid Program Timings");
      return;
    }

    if (
      Number(event.startTime.split(":")[0]) ===
        Number(event.endTime.split(":")[0]) &&
      Number(event.startTime.split(":")[1]) >
        Number(event.endTime.split(":")[1])
    ) {
      generateDangerAlert("Invalid Program Timings");
      return;
    }

    let allowed_department = [];

    for (let dept in event.target_audience) {
      if (event.target_audience[dept] === true) allowed_department.push(dept);
    }

    if (allowed_department.length === 0) {
      generateDangerAlert("Choose the Target Audience");
      return;
    }

    if (allowed_department.length > 1 && allowed_department.includes("All")) {
      generateDangerAlert("You cannot choose department since All is selected");
      return;
    }

    let event_date = new Date(event.date);
    // Generate Start and End Time in the format YYYY-MM-DDTHH:MM:SS.
    let start = new Date(
      event_date.getFullYear(),
      event_date.getMonth(),
      event_date.getDate(),
      event.startTime.slice(0, 2),
      event.startTime.slice(3, 5)
    );
    let end = new Date(
      event_date.getFullYear(),
      event_date.getMonth(),
      event_date.getDate(),
      event.endTime.slice(0, 2),
      event.endTime.slice(3, 5)
    );

    // Compress the image and upload it to firebase and store the generated url
    setLoading(true);

    const img = await handleImage();

    event.startTime = start;
    event.endTime = end;
    event.image = img;
    event.venueName = event.venue === "OTHERS**" && event.venueName;
    event.target_audience = allowed_department;

    if (img != "false") {
      if (formType === "Create") {
        const res = await fetch(
          "https://bookmyeventserver.vercel.app/api/addEvent",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              club: user.type != "HOD" && user.name,
              department: user.type != "General Club" && user.dept,
              email: user.email,
              ...event,
            }),
          }
        );
        const { status } = await res.json();
        if (status === "Success") navigate("/");
        else {
          setLoading(false);
          generateDangerAlert(status);
        }
      } else {
        const res = await fetch(
          "https://bookmyeventserver.vercel.app/api/updateEvent",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ event }),
          }
        );
        const { status } = await res.json();
        if (status === "Success") navigate("/view-profile");
        else {
          setLoading(false);
          generateDangerAlert(status);
        }
      }
    }
    else{
      setLoading(false);
      generateDangerAlert("Check your Image format")
    }
  }
  

  // Firebase Upload
  async function uploadImage(image) {
    const storageRef = ref(
      storage,
      `posters/${event.event}_${user.dept}_${event.date.toString()}`
    );
    await uploadBytes(storageRef, image);
    const res = await getDownloadURL(
      ref(
        storage,
        `posters/${event.event}_${user.dept}_${event.date.toString()}`
      )
    );
    return res;
  }

  // Compress the Image and then upload to Firebase
  async function handleImage() {
    if (event.image != undefined) {
      if (typeof event.image === "string") return event.image;
      if (event.image.type.startsWith("image/")) {
        try {
          // Compress Image
          const compressedFile = await compress(event.image, {
            quality: 0.4,
            type: "image/jpeg",
          });
          // Upload Image
          return uploadImage(
            new File([compressedFile], "file", { type: "image/jpeg" })
          );
        } catch (error) {
          "Error compressing image:", error;
        }
      } else {
        generateDangerAlert("Upload an image format file only");
        return "false";
      }
    } else {
      generateDangerAlert("Upload an image format file only");
      return "false";
    }
  }

  // Get all the department from Server and initialize the target audience
  async function fetchDept() {
    // Fetch All the department from Server
    await fetchTodayDate();
    const res = await fetch("https://bookmyeventserver.vercel.app/api/dept");
    const { dept } = await res.json();

    // Initialize Target Audience Object
    let target_audience = { All: false };

    // Department from Server will be in Ascending Order by default
    // Initialize every department as false
    // For New Event Page

    for (let department of dept) target_audience[department] = false;

    // Set the target audience state
    setEvent({ ...event, target_audience: target_audience });
    // Close the loading
    setLoading(false);
  }

  useEffect(() => {
    if (!user.isAuth) navigate("/");
    else if (formType === "Create") fetchDept();
  }, []);

  useEffect(() => {
    if (loading === true && formType === "Edit") setLoading(false);
    else setEvent({ ...event, venue: "CHOOSE A VENUE---" });
  }, [event.date, event.session]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="form-container">
      {/* Go back Button Section */}
      <Link to="/" className="go_back">
        <span className="material-symbols-outlined go_back_span">
          arrow_back
        </span>
      </Link>

      {/* Form */}

      <div className="card form">
        {/* Left Logo Section */}
        <div className="card-form-img">
          <img src={bme} className="form-logo" />
        </div>

        {/* Form input Section */}

        <div className="form-body">
          {/* Alert */}
          <div className={`alert alert-${alert.type} info`} ref={formBody}>
            {alert.info}
          </div>

          {/* Date */}
          <div className="group">
            <label
              className="label-group-input"
              style={{
                paddingRight: "5%",
                paddingLeft: "5%",
                justifyContent: "center",
              }}
            >
              Date*
            </label>
            <input
              className="form-control inputs"
              type="date"
              value={event.date}
              min={todayDate}
              onChange={checkDate}
              placeholder="dd-mm-yyy"
              required
              style={{ width: "100%" }}
            />
          </div>

          {/* Session */}
          <div className="session" onChange={checkDate}>
            {sessions.map((item, index) => {
              return (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <input
                    className="form-check-input border-dark"
                    type="radio"
                    value={item}
                    key={index}
                    name="Session"
                    defaultChecked={event.session === item ? true : false}
                  />
                  <label
                    className="form-check-label d-flex justify-content-center align-items-center"
                    style={{
                      height: "10%",
                    }}
                  >
                    {tsessions[index]}
                  </label>
                </div>
              );
            })}
          </div>

          {/* Audience and Venue */}
          <div className="group">
            <input
              className="form-control group-input"
              type="number"
              placeholder="No. of Audience*"
              min={1}
              value={event.audience}
              disabled={disable}
              onChange={(evt) => {
                setEvent({ ...event, audience: evt.target.value });
              }}
              required
            />
            <select
              className="form-select group-input"
              value={event.venue}
              onChange={(evt) => {
                setEvent({ ...event, venue: evt.target.value });
              }}
              disabled={disable}
              required
            >
              {venues.map((item, index) => {
                return (
                  <option
                    value={item}
                    key={index}
                    disabled={block.includes(item) ? true : false}
                  >
                    {item}
                  </option>
                );
              })}
            </select>
          </div>

          {event.venue === "OTHERS**" && (
            <div className="other-event-group">
              <input
                className="form-control"
                placeholder="Enter the venue*"
                value={event.venueName}
                onChange={(evt) => {
                  setEvent({ ...event, venueName: evt.target.value });
                }}
              />
            </div>
          )}

          {/* Event Name and Poster */}

          <div className="group">
            <input
              className="form-control group-input"
              placeholder="Name of the Event*"
              disabled={disable}
              value={event.event}
              onChange={(evt) => {
                setEvent({ ...event, event: evt.target.value });
              }}
              required
            />
            <input
              className="form-control group-input"
              placeholder="Event poster"
              type="file"
              disabled={disable}
              onChange={(evt) => {
                setEvent({ ...event, image: evt.target.files[0] });
              }}
            />
          </div>

          {/* Description */}
          <textarea
            className="form-control desc-input"
            placeholder="Description*"
            disabled={disable}
            value={event.description}
            onChange={(evt) => {
              setEvent({ ...event, description: evt.target.value });
            }}
            required
          />

          {/* Registration Link */}
          <input
            className="form-control other-event-group"
            placeholder="Registration Link"
            disabled={disable}
            value={event.link}
            onChange={(evt) => {
              setEvent({ ...event, link: evt.target.value });
            }}
          />

          {/* Target Audience */}
          <h5 className="target">Target Audience*</h5>
          <div
            className="checkbox"
            style={{
              height: `auto`,
              width: "90%",
              display: "flex",
              flexDirection: "column",
              position: "relative",
              left: "5%",
            }}
          >
            {Object.keys(event.target_audience).map((item) => {
              return (
                <span className="checkbox-item">
                  <input
                    className="checkbox-btn"
                    type="checkbox"
                    defaultChecked={event.target_audience[item] && true}
                    disabled={disable}
                    onChange={() => {
                      let temp = event.target_audience;
                      temp[item] = !temp[item];
                      setEvent({ ...event, target_audience: temp });
                    }}
                    value={item}
                  />
                  <label className="checkbox-name">{item}</label>
                </span>
              );
            })}
          </div>

          {/* Start and End Time */}

          <div className="time-group">
            <div className="time-group-input">
              <h5 className="label-group-input">Start Time*</h5>
              <input
                className="form-control"
                type="time"
                disabled={disable}
                value={event.startTime}
                onChange={(evt) => {
                  setEvent({ ...event, startTime: evt.target.value });
                }}
                required
              />
            </div>

            <div className="time-group-input">
              <h5 className="label-group-input">End Time*</h5>
              <input
                className="form-control"
                type="time"
                disabled={disable}
                placeholder="hh:mm"
                value={event.endTime}
                onChange={(evt) => {
                  setEvent({ ...event, endTime: evt.target.value });
                }}
                required
              />
            </div>
          </div>

          <div
            className="group"
            style={{
              marginLeft: "50px",
              height: "auto",
              flexDirection: "column",
              color: "red",
            }}
          >
            <h6>** - Represents the availablity of venue is not guarantee.</h6>
            <h6>Poster Image should be in Image format (jpeg/jpg/png)</h6>
            <h6>Registration link is not compulsory to enter</h6>
          </div>
          <button
            className="submit-btn"
            onClick={validateData}
            disabled={disable}
          >
            SUBMIT
          </button>
        </div>
      </div>
    </div>
  );
}
