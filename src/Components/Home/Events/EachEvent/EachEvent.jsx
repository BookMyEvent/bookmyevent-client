import { useSelector, useDispatch } from "react-redux";
import { setView } from "../../../../slice/viewSlice";
import "./eachEvent.css";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { BASE_URL } from "../../../../constants";

export default function EachEvent({
  _id,
  image,
  startTime,
  event,
  venue,
  venueName,
  authUser,
}) {
  const [flag, setFlag] = useState(false);
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const view = useSelector((store) => store.view);
  const [confirm, setConifrm] = useState(false);

  // Only for Profile->Events Section (Delete an Event)
  async function deleteEvent() {
    const res = await fetch(
      `${BASE_URL}/api/deleteEvent`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          _id,
        }),
      }
    );
    const { status } = await res.json();
    if (status === "Success") {
      navigate("/");
    }
  }

  // For Detailed View
  function setViewMore() {
    dispatch(setView({ _id }));
  }


  return (
    <div
      className="each-event-card-event"
      style={{ backgroundImage: `url(${image})` }}
      onClick={(!authUser || new Date(startTime).getTime() < new Date().getTime()) && setViewMore}
      data-aos="zoom-in"
      onMouseEnter={() => {
        setFlag(true);
      }}
      onMouseLeave={() => {
        setFlag(false);
      }}  
    >

      {/* Common for both home->event component and profile->events component  */}
      <div className="each-event-event-info">
        <h3 className="each-event-event-name">{event}</h3>
        <h5 className="each-event-view-event-details">
          <span className="material-symbols-outlined each-event-event-icon">
            location_on
          </span>
          {venue != "OTHERS**" ? venue : venueName}
        </h5>
        <h5 className="each-event-view-event-details">
          <span className="material-symbols-outlined each-event-event-icon">
            calendar_month
          </span>
          {new Date(startTime).toLocaleDateString(undefined, {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </h5>
      </div>

      {/* Only for Profile->Events Component */}

      {authUser &&
        flag &&
        new Date(startTime).getTime() > new Date().getTime() && (
          <>
            <div className="user-event-btn">
              <Link
                to={`/edit-event/${_id}`}
                className="btn btn-white d-flex flex-direction-row align-items-center justify-content-center"
              >
                <i className="fa-regular fa-pen-to-square d-flex flex-direction-row align-items-center justify-content-center fs-1 text-primary"></i>
              </Link>
              <button
                className="btn btn-white d-flex flex-direction-row align-items-center justify-content-center text-danger"
                onClick={() => {
                  setConifrm(true);
                }}
              >
                <i className="fa-sharp fa-regular fa-trash-can d-flex flex-direction-row align-items-center justify-content-center fs-1"></i>
              </button>
            </div>
          </>
        )}

        
      {authUser && confirm && (
        <div className="confirm">
          <h2 className="confirm-title">
            Are you sure you want to cancel this event
          </h2>
          <div className="confirm-btn">
            <button
              className="btn btn-danger confirm-del"
              onClick={deleteEvent}
            >
              DELETE
            </button>
            <button
              className="btn btn-light confirm-close"
              onClick={() => {
                setConifrm(false);
              }}
            >
              CLOSE
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
