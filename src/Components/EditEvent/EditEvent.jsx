import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams, Link } from "react-router-dom";
import Loading from "../Loading/Loading";
import Form from "../Form/Form";
import "../Form/form.css";

function EditEvent() {
  const user = useSelector((store) => store.user);
  const navigate = useNavigate();
  const { _id } = useParams();
  const [event, setEvent] = useState({});
  const [loading, setLoading] = useState(true);
  
  // Only for Edit
  async function fetchEvents() {
    // Fetch the event details from server
    const res = await fetch(
      "https://bookmyeventserver.vercel.app/api/retrieveEvent",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          _id,
        }),
      }
    );
    const data = await res.json();

    // Check whether event details exist and authenticate user has requested
    if (
      data.type === "Success" &&
      (user.name === data.event.club || user.dept === data.event.department)
    ) {
      data.event.target_audience = await fetchDept(data.event);
      data.event.startTime = `${
                    new Date(data.event.startTime).getHours() < 10
                      ? `0${new Date(data.event.startTime).getHours()}`
                      : new Date(data.event.startTime).getHours()
                  }:${
                    new Date(data.event.startTime).getMinutes() < 10
                      ? `0${new Date(data.event.startTime).getMinutes()}`
                      : new Date(data.event.startTime).getMinutes()
                  }`;

      data.event.endTime = `${
                    new Date(data.event.endTime).getHours() < 10
                      ? `0${new Date(data.event.endTime).getHours()}`
                      : new Date(data.event.endTime).getHours()
                  }:${
                    new Date(data.event.endTime).getMinutes() < 10
                      ? `0${new Date(data.event.endTime).getMinutes()}`
                      : new Date(data.event.endTime).getMinutes()
                  }`;
      setEvent({ ...data.event, date: data.event.date.slice(0, 10) });
      setLoading(false);
    } else {
      navigate("/");
    }
  }

  // Convert the target audience array to Object
  async function fetchDept(event) {

    // Fetch All the department from Server
    const res = await fetch("https://bookmyeventserver.vercel.app/api/dept");
    const { dept } = await res.json();

    // Initialize Target Audience Object
    let target_audience = { All: false };

    // Department from Server will be in Ascending Order by default
    // Initialize every department as false
    // For Edit Event Page

    for (let department of dept) {
      if (event.target.includes(department)) target_audience[department] = true;
      else target_audience[department] = false;
    }

    if (event.target.includes("All")) target_audience["All"] = true;

    return target_audience;

  }


  useEffect(() => {
    if (!user.isAuth) {
      navigate("/");
    } else {
      fetchEvents();
    }
  }, []);

  if (loading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }
  return <Form formType={"Edit"} eventData={event} />;
}

export default EditEvent;
