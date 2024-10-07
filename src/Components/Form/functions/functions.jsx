import { BASE_URL, CHATBOT_BASE_URL } from "../../../constants";

// Invokes when date/session field changes
function checkDate(
  evt,
  event,
  setEvent,
  setAlert,
  setDisable,
  formType,
  setBlock
) {
  if (evt.target.type === "date") {
    setEvent({ ...event, date: evt.target.value });
    fetchBlockDates(
      evt.target.value,
      event.session,
      setAlert,
      setDisable,
      formType,
      setBlock
    );
  } else {
    setEvent({ ...event, session: evt.target.value });
    fetchBlockDates(
      event.date,
      evt.target.value,
      setAlert,
      setDisable,
      formType,
      setBlock
    );
  }
}

// To Fetch Today Date and Time
async function fetchTodayDate(setTodayDate) {
  // API Call to get accurate IST
  const res = await fetch("https://worldtimeapi.org/api/timezone/Asia/Kolkata");
  const data = await res.json();

  // Date Format ->  YYYY-MM-DD
  setTodayDate(new Date(data["datetime"]).toISOString().slice(0, 10));
}

// Invokes when error occurs
function generateDangerAlert(info, setAlert, formBody) {
  setAlert({
    type: "danger",
    info: info,
  });
  formBody.current.scrollIntoView();
}

// Fetch the Blocked Venues for Given Date & Session
async function fetchBlockDates(
  date,
  session,
  setAlert,
  setDisable,
  formType,
  setBlock
) {
  if (date != "" && session != "") {
    // Temporarily disable all the input fields till the blocked venues is fetched
    setDisable(true);

    // Fetch the blocked Venues from Server
    const result = await fetch(`${BASE_URL}/api/checkDate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: date,
        session: session,
      }),
    });
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

// Get all the department from Server and initialize the target audience
async function fetchDept(event, setTodayDate, setEvent, setLoading) {
  // Fetch All the department from Server
  await fetchTodayDate(setTodayDate);
  const res = await fetch(`${BASE_URL}/api/dept`);
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

export {
  generateDangerAlert,
  checkDate,
  fetchDept,
};
