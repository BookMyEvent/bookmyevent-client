import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setView } from "../../../slice/viewSlice";
import EachEvent from "../../Home/Events/EachEvent/EachEvent";
import Loading from "../../Loading/Loading";
import { BASE_URL } from "../../../constants";
import "./myevents.css";

function MyEvents() {
  const user = useSelector((store) => store.user);
  const [userEvents, setUserEvents] = useState([]);
  const [loading, setLoading] = useState(true);


// Fetch All the Events Conducted by the User   
  async function fetchUserEvents() {
    let res = undefined;

    // For Club Users
    if (user.type != "HOD")
      res = await fetch(`${BASE_URL}/api/userevents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: user.name,
        }),
      });
    // For HOD's
    else
      res = await fetch(`${BASE_URL}/api/userevents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dept: user.dept,
        }),
      });
    const user_events = await res.json();
    // Sort by date
    user_events.sort((a, b) => {
      let a1 = new Date(a.startTime);
      let b1 = new Date(b.startTime);
      return a1 - b1;
    });
    // Update the states
    setUserEvents(user_events);
    setLoading(false);
  }

  // Initialization
  useEffect(() => {
    fetchUserEvents();
  }, []);

  // Loading Page while Fetching
  if (loading) {
    return <Loading />;
  }

  // Main Page
  return (
    <div className="user-events">
      {userEvents.length > 0 ? (
        <div className="upcoming">
          {userEvents.map((item) => (
            <EachEvent index {...item} authUser={true}/>
          ))}
        </div>
      ) : (
        <h2 className="no-event">MAKE YOUR FIRST EVENT NOW!</h2>
      )}
    </div>
  );
}

export default MyEvents;
