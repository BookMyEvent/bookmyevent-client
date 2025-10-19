import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import Loading from "../Loading/Loading";
import bme from "../../Assets/bookmyevent.png";
import ChatBotMail from "./ChatBotMail";
import { checkDate, fetchDept } from "./functions/functions";
import { validateData } from "./functions/validation";
import "./form.css";


export default function Form({ formType, eventData }) {
  // User Details
  const user = useSelector((store) => store.user);
  // Get the selected group mail ids
  const mail = useSelector((store) => store.mail);

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

  // List of Venues
  const venues = [
    "CHOOSE A VENUE---",
    // "MULTI PURPOSE HALL",
    //"FUNCTION HALL",
    //"VIDEO HALL",
    "LIBRARY SEMINAR HALL",
    "Function hall, 3rd floor, central library",
    //"BIO TECH SEMINAR HALL",
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

  useEffect(() => {
    if (!user.isAuth) navigate("/");
    else if (formType === "Create") fetchDept(event,setTodayDate,setEvent,setLoading);
  }, []);

  useEffect(() => {
    if (loading === true && formType === "Edit") setLoading(false);
    else setEvent({ ...event, venue: "CHOOSE A VENUE---" });
  }, [event.date, event.session]);

  // Loading Page
  if (loading) {
    return <Loading />;
  }
  
  // Form Page
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
              onChange={(evt)=>{checkDate(evt,event,setEvent,setAlert,setDisable,formType,setBlock)}}
              placeholder="dd-mm-yyy"
              required
              style={{ width: "100%" }}
            />
          </div>

          {/* Session */}
          <div className="session" onChange={(evt)=>{checkDate(evt,event,setEvent,setAlert,setDisable,formType,setBlock)}}>
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
              min={0}
              value={event.audience == 0 ? "" : event.audience}
              disabled={disable}
              onChange={(evt) => {
                setEvent({ ...event, audience: Number(evt.target.value) });
              }}
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

          {/* Chatbot Mail Integration */}
          <ChatBotMail disable={disable} />

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
            onClick={(evt)=>{validateData(evt,formType,event,setAlert,formBody,block,mail,user,setLoading,navigate)}}
            disabled={disable}
          >
            SUBMIT
          </button>
        </div>
      </div>
    </div>
  );
}
