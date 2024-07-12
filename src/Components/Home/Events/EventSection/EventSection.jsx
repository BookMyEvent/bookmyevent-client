import React, { useState,useEffect } from "react";
import EachEvent from "../EachEvent/EachEvent";
import "./eventSection.css";

function EventSection({ eventData, name }) {
  // Sorting the events

  const [option, setOption] = useState("date");
  const [events, setEvents] = useState(eventData);
  const [sortedEvents, setSortedEvents] = useState({});

  async function sortEvents(option) {
    //Date Wise
    if (option === "date") {
      events.sort((a, b) => {
        let a1 = new Date(a.startTime);
        let b1 = new Date(b.startTime);
        return a1 - b1;
      });
      setEvents(events);
      return;
    }

    //Venue Wise
    if (option === "venue") {
      let bookedVenues = {};
      events.map((item) => {
        if (item.venue === "OTHERS**") {
          if (bookedVenues[item.venueName])
            bookedVenues[item.venueName].push(item);
          else bookedVenues[item.venueName] = new Array(item);
        } else {
          if (bookedVenues[item.venue]) bookedVenues[item.venue].push(item);
          else bookedVenues[item.venue] = new Array(item);
        }
      });
      setSortedEvents(bookedVenues);
      return;
    }

    // Split the events based on department / club

    let department_wise_events = {};
    let department_list = undefined;
    let dept = "";
    for (let event of events) {
      dept = event.department != "false" ? event.department : event.club;
      if (department_wise_events[dept])
        department_wise_events[dept].push(event);
      else department_wise_events[dept] = new Array(event);
    }

    department_list = Object.keys(department_wise_events);

    //Department Ascending Wise

    let sorted_department_wise_events = {};
    if (option === "dept-asc") {
      department_list.sort();
      for (let i = 0; i < department_list.length; i++) {
        sorted_department_wise_events[department_list[i]] =
          department_wise_events[department_list[i]];
      }
      setSortedEvents(sorted_department_wise_events);
    }

    //Department Descending Wise
    else if (option === "dept-desc") {
      department_list.sort((a, b) => {
        if (a > b) return -1;
        else return 1;
      });

      for (let i = 0; i < department_list.length; i++) {
        sorted_department_wise_events[department_list[i]] =
          department_wise_events[department_list[i]];
      }

      setSortedEvents(sorted_department_wise_events);
    }

    //Target Audience
    else {
      // Fetch All the departments from server
      const res = await fetch("https://bookmyeventserver.vercel.app/api/dept");
      const { dept } = await res.json();

      let target_audience_wise = {};
      for (let event of events) {
        if (event.target.includes("All")) {
          if (target_audience_wise["All"]) target_audience_wise["All"].push(event);
          else target_audience_wise["All"] = new Array(event);
        }
      }

      for (let department of dept) {
        for (let event of events) {
          if (event.target.includes(department)) {
            if (target_audience_wise[department]) target_audience_wise[department].push(event);
            else target_audience_wise[department] = new Array(event);
          }
        }
      }
      setSortedEvents(target_audience_wise);
    }
  }

  useEffect(() => {
    sortEvents(option);
  }, [option]);

  return (
    <>
      {/* Sorting section */}
      <div className="title" data-aos="fade-down">
        <h2 className="sub-title">{name}</h2>
        <div className="sort">
          <select
            className="form-select option"
            value={option}
            onChange={(evt) => setOption(evt.target.value)}
          >
            <option value="date" className="choice">
              Date
            </option>
            <option value="dept-asc" className="choice">
              Department (A..Z)
            </option>
            <option value="dept-desc" className="choice">
              Department (Z..A)
            </option>
            <option value="target" className="choice">
              Target Students
            </option>
            <option value="venue" className="choice">
              Venues
            </option>
          </select>
        </div>
      </div>

      {/* Event List */}
      {option === "date" ? (
        <div className="upcoming">
          {eventData.map((item, index) => {
            return <EachEvent {...item} />;
          })}
        </div>
      ) : (
        Object.keys(sortedEvents).map((item, index) => {
          return (
            <>
              <h2 className="dept" data-aos="fade-down">
                {item}
              </h2>
              <div className="upcoming">
                {Object.values(sortedEvents[item]).map((item, index) => {
                  return <EachEvent {...item} index />;
                })}
              </div>
            </>
          );
        })
      )}
    </>
  );
}

export default EventSection;
