import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import Loading from "../Loading/Loading";
import bme from "../../Assets/bookmyevent.png";
import { storage } from "../../auth/firebase";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { compress, compressAccurately } from "image-conversion";

import "./form.css";

export default function Form() {
  const user = useSelector((store) => store.user);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState("");
  const [audience, setAudience] = useState(0);
  const [venue, setVenue] = useState("");
  const [event, setEvent] = useState("");
  const [desc, setDesc] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [image, setImage] = useState("");
  const [block, setBlock] = useState([]);
  const [session, setSession] = useState("");
  const [link, setLink] = useState("");
  const [audienceType, setAudienceType] = useState({});
  const [venueName, setVenueName] = useState("");

  const formBody = useRef();

  const [alert, setAlert] = useState({
    type: "info",
    info: "Enter the Date and Session",
  });
  const [disable, setDisable] = useState(true);

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

  const venues = [
    "CHOOSE A VENUE---",
    "MULTI PURPOSE HALL",
    "LIBRARY SEMINAR HALL",
    "BIO TECH SEMINAR HALL",
    "LIBRARY CONFERENCE HALL",
    "OTHERS**",
  ];
  const sessions = ["FN", "AN", "EVNG", "Full Day"];
  const tsessions = [
    "9:00 AM-12:00 PM",
    "01:00 PM-04:00 PM",
    "04:00 PM-08:00 PM",
    "Full Day",
  ];

  async function fetchBlockDates(det1, det2) {
    if (det2 != "" && det1 != "") {
      setDisable(true);
      const result = await fetch(
        "https://bookmyeventserver.vercel.app/api/checkDate",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            date: det1,
            session: det2,
          }),
        }
      );
      const programs = await result.json();
      let lst = programs.blocked;
      let temp = lst.map((item) => item[1]);
      setBlock(temp);

      if (lst.length === 6) {
        setAlert({
          type: "warning",
          info: "Oops! All venues are full.You can use either your Department or others",
        });
      }
      setAlert({
        type: "success",
        info: "Venues are available",
      });
      setDisable(false);
    }
  }

  function checkDate(evt) {
    if (evt.target.type === "date") {
      setDate(evt.target.value);
      fetchBlockDates(evt.target.value, session);
    } else {
      setSession(evt.target.value);
      fetchBlockDates(date, evt.target.value);
    }
    setVenue("CHOOSE A VENUE---");
  }

  function generateDangerAlert(info) {
    setAlert({
      type: "danger",
      info: info,
    });
    formBody.current.scrollIntoView();
  }

  async function validateData(evt) {
    evt.preventDefault();
    if (audience === 0) {
      generateDangerAlert("Enter the audience limit");
      return;
    }
    if (venue === "" || venue === "CHOOSE A VENUE---") {
      generateDangerAlert("Enter the venue");
      return;
    }

    switch (venue) {
      case "LIBRARY CONFERENCE HALL":
        if (audience > 25) {
          generateDangerAlert("Maximum Allowed Occupancy - 25");
          return;
        }
        break;

      case "BIO TECH SEMINAR HALL": // Upto 80
        if (audience > 80) {
          generateDangerAlert("Maximum Allowed Occupancy - 80");
          return;
        }
        break;

      case "LIBRARY SEMINAR HALL": //Upto 80
        if (audience > 80) {
          generateDangerAlert("Maximum Allowed Occupancy - 80");
          return;
        }
        break;

      case "VIDEO HALL": //Upto 120
        if (audience <= 80 && !block.includes("BIO TECH SEMINAR HALL")) {
          generateDangerAlert("Bio-tech Seminar Hall is Available");
          return;
        }
        if (audience <= 80 && !block.includes("LIBRARY SEMINAR HALL")) {
          generateDangerAlert("Library Seminar Hall is Available");
          return;
        }
        if (audience > 120) {
          generateDangerAlert("Maximum Allowed Occupancy - 120");
          return;
        }
        break;

      case "FUNCTION HALL": // Upto 240
        if (audience <= 80 && !block.includes("BIO TECH SEMINAR HALL")) {
          generateDangerAlert("Bio-tech Seminar Hall is Available");
          return;
        }

        if (audience <= 80 && !block.includes("LIBRARY SEMINAR HALL")) {
          generateDangerAlert("Library Seminar Hall is Available");
          return;
        }

        if (audience <= 120 && !block.includes("VIDEO HALL")) {
          generateDangerAlert("Video Hall is Available");
          return;
        }

        if (audience > 240) {
          generateDangerAlert("Maximum Allowed occupancies - 240");
          return;
        }

        break;

      case "MULTI PURPOSE HALL":
        if (audience <= 80 && !block.includes("BIO TECH SEMINAR HALL")) {
          generateDangerAlert("Bio-tech Seminar Hall is Available");
          return;
        }

        if (audience <= 80 && !block.includes("LIBRARY SEMINAR HALL")) {
          generateDangerAlert("Library Seminar Hall is Available");
          return;
        }

        if (audience <= 120 && !block.includes("VIDEO HALL")) {
          generateDangerAlert("Video Hall is Available");
          return;
        }

        if (audience <= 240 && !block.includes("FUNCTION HALL")) {
          generateDangerAlert("Function Hall is Available");
          return;
        }
        break;

      case "OTHERS**":
        if (venueName.trim() === "") {
          generateDangerAlert("Enter the Venue");
          return;
        }
        break;
    }

    if (event.trim() === "") {
      generateDangerAlert("Enter the Event Name");
      return;
    }
    if (image === "") {
      generateDangerAlert("Upload the Event Image");
      return;
    }
    if (desc.trim() === "") {
      generateDangerAlert("Enter the Description");
      return;
    }
    if (startTime.trim() === "") {
      generateDangerAlert("Enter the Event Start Time");
      return;
    }
    if (endTime.trim() === "") {
      generateDangerAlert("Enter the Event End Time");
      return;
    }

    switch (session) {
      case "FN":
        if (
          Number(endTime.split(":")[0]) === 12 &&
          Number(endTime.split(":")[1]) > 0
        ) {
          generateDangerAlert("Program should end by 12:00 PM");
          return;
        }
        if (Number(endTime.split(":")[0]) > 12) {
          generateDangerAlert("Program should end by 12:00 PM");
          return;
        }
        break;
      case "AN":
        if (Number(startTime.split(":")[0]) < 13) {
          generateDangerAlert("Program should start from atleast 1:00 PM");
          return;
        }
        break;

      case "EVNG":
        if (Number(startTime.split(":")[0]) < 16) {
          generateDangerAlert("Program should start from atleast 4:00 PM");
          return;
        }
        break;
    }
    if (Number(startTime.split(":")[0]) > Number(endTime.split(":")[0])) {
      generateDangerAlert("Invalid Program Timings");
      return;
    }

    if (
      Number(startTime.split(":")[0]) === Number(endTime.split(":")[0]) &&
      Number(startTime.split(":")[1]) > Number(endTime.split(":")[1])
    ) {
      generateDangerAlert("Invalid Program Timings");
      return;
    }

    let allowed = [];
    for (let item in audienceType) {
      if (audienceType[item] === true) allowed.push(item);
    }
    if (allowed.length === 0) {
      generateDangerAlert("Choose the Target Audience");
      return;
    }

    if (allowed.length > 1 && allowed.includes("All")) {
      generateDangerAlert("You cannot choose department since All is selected");
      return;
    }

    let temp = new Date(date);
    let start = new Date(
      temp.getFullYear(),
      temp.getMonth(),
      temp.getDate(),
      startTime.slice(0, 2),
      startTime.slice(3, 5)
    );
    let end = new Date(
      temp.getFullYear(),
      temp.getMonth(),
      temp.getDate(),
      endTime.slice(0, 2),
      endTime.slice(3, 5)
    );

    const img = await handleImage();

    if (img != "false") {
      setLoading(true);
      const res = await fetch(
        "https://bookmyeventserver.vercel.app/api/addEvent",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            date,
            audience,
            venue,
            event,
            description: desc,
            start,
            end,
            session,
            link,
            club: user.type != "HOD" && user.name,
            dept: user.type != "General Club" && user.dept,
            image: img,
            allowed,
            venueName: venue === "OTHERS**" && venueName,
            email: user.email,
          }),
        }
      );
      const { status } = await res.json();
      if (status === "Success") navigate("/");
      else {
        setLoading(false);
        generateDangerAlert(status);
      }
    }
  }

  // Firebase Upload
  async function uploadImage(image) {
    const storageRef = ref(
      storage,
      `posters/${event}_${user.dept}_${date.toString()}`
    );
    await uploadBytes(storageRef, image);
    const res = await getDownloadURL(
      ref(storage, `posters/${event}_${user.dept}_${date.toString()}`)
    );
    return res;
  }

  async function handleImage() {
    if (image != undefined) {
      if (image.type.startsWith("image/")) {
        try {
          // Compress Image
          const compressedFile = await compress(image, {quality:0.4,type:'image/jpeg'});
          // Upload Image
          return uploadImage(new File([compressedFile],'file',{type:'image/jpeg'}));
        } catch (error) {
          console.log("Error compressing image:", error);
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

  async function fetchDept() {
    const res = await fetch("https://bookmyeventserver.vercel.app/api/dept");
    const { dept } = await res.json();
    let temp = { All: false };
    dept.sort((a, b) => {
      let a1 = a.toLowerCase();
      let b1 = b.toLowerCase();
      if (a1 < b1) {
        return -1;
      }
      if (a1 > b1) {
        return 1;
      }
      return 0;
    });
    for (let i of dept) temp[i] = false;
    setAudienceType(temp);
    setLoading(false);
  }

  useEffect(() => {
    if (!user.isAuth) navigate("/");
    fetchDept();
    console.log(1);
  }, []);

  if (loading) {
    return <Loading />;
  }

  console.log(audienceType);

  return (
    <div className="form-container">
      <Link
        to="/"
        style={{
          width: "fit-content",
          height: "auto",
          textDecoration: "none",
          position: "fixed",
          top: "1%",
          left: "1%",
        }}
      >
        <span
          class="material-symbols-outlined"
          style={{
            width: "fit-content",
            height: "auto",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            textDecoration: "none",
            borderRadius: "50%",
            border: "1px solid white",
            padding: "30%",
            fontSize: "xx-large",
            color: "white",
          }}
        >
          arrow_back
        </span>
      </Link>
      <div className="card form">
        <div className="card-form-img">
          <img src={bme} className="form-logo" />
        </div>
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
              min={new Date().toISOString().slice(0, 10)}
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
              disabled={disable}
              onChange={(evt) => {
                setAudience(evt.target.value);
              }}
              required
            />
            <select
              className="form-select group-input"
              value={venue}
              onChange={(evt) => {
                setVenue(evt.target.value);
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

          {venue === "OTHERS**" && (
            <div className="other-event-group">
              <input
                className="form-control"
                placeholder="Enter the venue*"
                onChange={(evt) => {
                  setVenueName(evt.target.value);
                }}
              />
            </div>
          )}

          <div className="group">
            <input
              className="form-control group-input"
              placeholder="Name of the Event*"
              disabled={disable}
              onChange={(evt) => {
                setEvent(evt.target.value);
              }}
              required
            />
            <input
              className="form-control group-input"
              placeholder="Event poster"
              type="file"
              disabled={disable}
              onChange={(evt) => {
                setImage(evt.target.files[0]);
              }}
            />
          </div>
          <textarea
            className="form-control desc-input"
            placeholder="Description*"
            disabled={disable}
            onChange={(evt) => {
              setDesc(evt.target.value);
            }}
            required
          />
          <input
            className="form-control other-event-group"
            placeholder="Registration Link"
            disabled={disable}
            onChange={(evt) => {
              setLink(evt.target.value);
            }}
          />
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
            {Object.keys(audienceType).map((item) => {
              return (
                <span className="checkbox-item">
                  <input
                    className="checkbox-btn"
                    type="checkbox"
                    disabled={disable}
                    onChange={() => {
                      let temp = audienceType;
                      temp[item] = !temp[item];
                      setAudienceType(temp);
                    }}
                    value={item}
                  />
                  <label className="checkbox-name">{item}</label>
                </span>
              );
            })}
          </div>

          <div className="time-group">
            <div className="time-group-input">
              <h5 className="label-group-input">Start Time*</h5>
              <input
                className="form-control"
                type="time"
                disabled={disable}
                placeholder="hh:mm"
                onChange={(evt) => {
                  setStartTime(evt.target.value);
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
                onChange={(evt) => {
                  setEndTime(evt.target.value);
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
