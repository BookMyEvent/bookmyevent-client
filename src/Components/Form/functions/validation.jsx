import { generateDangerAlert } from "./functions.jsx";
import { storage } from "../../../auth/firebase";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { compress } from "image-conversion";
import { BASE_URL } from "../../../constants";
import { sendMail } from "./automatedEventMail.jsx";

// Validate all the field values
async function validateData(
  evt,
  formType,
  event,
  setAlert,
  formBody,
  block,
  mail,
  user,
  setLoading,
  navigate
) {
  evt.preventDefault();

  // Check for Audience Count
  if (event.audience === 0) {
    generateDangerAlert("Enter the audience limit", setAlert, formBody);
    return;
  }

  //   Check for Venue
  if (event.venue === "" || event.venue === "CHOOSE A VENUE---") {
    generateDangerAlert("Enter the venue", setAlert, formBody);
    return;
  }

  //   Check whether specifed audience is allowed in the specified venue
  switch (event.venue) {
    case "LIBRARY CONFERENCE HALL":
      if (event.audience > 25) {
        generateDangerAlert(
          "Maximum Allowed Occupancy - 25",
          setAlert,
          formBody
        );
        return;
      }
      break;

    case "BIO TECH SEMINAR HALL": // Upto 80
      if (event.audience > 80) {
        generateDangerAlert(
          "Maximum Allowed Occupancy - 80",
          setAlert,
          formBody
        );
        return;
      }
      break;

    case "LIBRARY SEMINAR HALL": //Upto 80
      if (event.audience > 80) {
        generateDangerAlert(
          "Maximum Allowed Occupancy - 80",
          setAlert,
          formBody
        );
        return;
      }
      break;

    case "VIDEO HALL": //Upto 120
      if (event.audience <= 80 && !block.includes("BIO TECH SEMINAR HALL")) {
        generateDangerAlert(
          "Bio-tech Seminar Hall is Available",
          setAlert,
          formBody
        );
        return;
      }
      if (event.audience <= 80 && !block.includes("LIBRARY SEMINAR HALL")) {
        generateDangerAlert(
          "Library Seminar Hall is Available",
          setAlert,
          formBody
        );
        return;
      }
      if (event.audience > 120) {
        generateDangerAlert(
          "Maximum Allowed Occupancy - 120",
          setAlert,
          formBody
        );
        return;
      }
      break;

    case "FUNCTION HALL": // Upto 240
      if (event.audience <= 80 && !block.includes("BIO TECH SEMINAR HALL")) {
        generateDangerAlert(
          "Bio-tech Seminar Hall is Available",
          setAlert,
          formBody
        );
        return;
      }

      if (event.audience <= 80 && !block.includes("LIBRARY SEMINAR HALL")) {
        generateDangerAlert(
          "Library Seminar Hall is Available",
          setAlert,
          formBody
        );
        return;
      }

      if (event.audience <= 120 && !block.includes("VIDEO HALL")) {
        generateDangerAlert("Video Hall is Available", setAlert, formBody);
        return;
      }

      if (event.audience > 240) {
        generateDangerAlert(
          "Maximum Allowed occupancies - 240",
          setAlert,
          formBody
        );
        return;
      }

      break;

    case "MULTI PURPOSE HALL":
      if (event.audience <= 80 && !block.includes("BIO TECH SEMINAR HALL")) {
        generateDangerAlert(
          "Bio-tech Seminar Hall is Available",
          setAlert,
          formBody
        );
        return;
      }

      if (event.audience <= 80 && !block.includes("LIBRARY SEMINAR HALL")) {
        generateDangerAlert(
          "Library Seminar Hall is Available",
          setAlert,
          formBody
        );
        return;
      }

      if (event.audience <= 120 && !block.includes("VIDEO HALL")) {
        generateDangerAlert("Video Hall is Available", setAlert, formBody);
        return;
      }

      if (event.audience <= 240 && !block.includes("FUNCTION HALL")) {
        generateDangerAlert("Function Hall is Available", setAlert, formBody);
        return;
      }
      break;

    case "OTHERS**":
      if (event.venueName.trim() === "") {
        generateDangerAlert("Enter the Venue", setAlert, formBody);
        return;
      }
      break;
  }

  //   Check for event title
  if (event.event.trim() === "") {
    generateDangerAlert("Enter the Event Name", setAlert, formBody);
    return;
  }

  //   Check for event poster
  if (event.image === "") {
    generateDangerAlert("Upload the Event Image", setAlert, formBody);
    return;
  }

  //   Check for description
  if (event.description.trim() === "") {
    generateDangerAlert("Enter the Description", setAlert, formBody);
    return;
  }

  //   Check for event start time
  if (event.startTime.trim() === "") {
    generateDangerAlert("Enter the Event Start Time", setAlert, formBody);
    return;
  }

  //   Check for event end time
  if (event.endTime.trim() === "") {
    generateDangerAlert("Enter the Event End Time", setAlert, formBody);
    return;
  }

  //   Check whether the timings are within the session
  switch (event.session) {
    case "FN":
      if (
        (Number(event.endTime.split(":")[0]) === 12 &&
          Number(event.endTime.split(":")[1]) > 0) ||
        Number(event.endTime.split(":")[0]) > 12
      ) {
        generateDangerAlert(
          "Program should end by 12:00 PM",
          setAlert,
          formBody
        );
        return;
      }
      break;
    case "AN":
      if (Number(event.startTime.split(":")[0]) < 13) {
        generateDangerAlert(
          "Program should start from atleast 1:00 PM",
          setAlert,
          formBody
        );
        return;
      }

      if (
        (Number(event.endTime.split(":")[0]) === 16 &&
          Number(event.endTime.split(":")[1]) > 0) ||
        Number(event.endTime.split(":")[0]) > 16
      ) {
        generateDangerAlert(
          "Program should end by 04:00 PM",
          setAlert,
          formBody
        );
        return;
      }

      break;

    case "EVNG":
      if (Number(event.startTime.split(":")[0]) < 16) {
        generateDangerAlert(
          "Program should start from atleast 4:00 PM",
          setAlert,
          formBody
        );
        return;
      }
      break;
  }
  if (
    Number(event.startTime.split(":")[0]) > Number(event.endTime.split(":")[0])
  ) {
    generateDangerAlert("Invalid Program Timings", setAlert, formBody);
    return;
  }

  if (
    Number(event.startTime.split(":")[0]) ===
      Number(event.endTime.split(":")[0]) &&
    Number(event.startTime.split(":")[1]) > Number(event.endTime.split(":")[1])
  ) {
    generateDangerAlert("Invalid Program Timings", setAlert, formBody);
    return;
  }

  //   Get the target audience
  let allowed_department = [];

  for (let dept in event.target_audience) {
    if (event.target_audience[dept] === true) allowed_department.push(dept);
  }

  //   Check for target audience
  if (allowed_department.length === 0) {
    generateDangerAlert("Choose the Target Audience", setAlert, formBody);
    return;
  }

  //   If All and specific department is selected through error
  if (allowed_department.length > 1 && allowed_department.includes("All")) {
    generateDangerAlert(
      "You cannot choose department since All is selected",
      setAlert,
      formBody
    );
    return;
  }


  // Check for automated mail
  if(mail.flag){
    if(mail.mail_id.length == 0){
      generateDangerAlert("Choose the mail id group", setAlert, formBody);
      return;
    }
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

  const img = await handleImage(event, user, setAlert, formBody);

  //   Update the state values
  event.date = event_date;
  event.startTime = start;
  event.endTime = end;
  event.image = img;
  event.venueName = event.venue === "OTHERS**" && event.venueName;
  event.target_audience = allowed_department;

  if (img != "false") {
    if (formType === "Create") {
      await createEvent(
        event,
        user,
        mail,
        generateDangerAlert,
        setAlert,
        formBody,
        setLoading,
        navigate
      );
    } else {
      await updateEvent(
        event,
        generateDangerAlert,
        setAlert,
        formBody,
        setLoading,
        navigate
      );
    }
  } else {
    setLoading(false);
    generateDangerAlert("Check your Image format", setAlert, formBody);
  }
}

// Add an Event
async function createEvent(
  event,
  user,
  mail,
  generateDangerAlert,
  setAlert,
  formBody,
  setLoading,
  navigate
) {
  const res = await fetch(`${BASE_URL}/api/addEvent`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      club: user.type != "HOD" && user.name,
      department: user.type != "General Club" && user.dept,
      email: user.email,
      ...event,
    }),
  });
  const { status } = await res.json();
  if (status === "Success") {
    if(mail.flag){
      await sendMail(event, mail, user);
    }
    navigate("/");
  } else {
    setLoading(false);
    generateDangerAlert(status, setAlert, formBody);
  }
}

// Update an event
async function updateEvent(
  event,
  generateDangerAlert,
  setAlert,
  formBody,
  setLoading,
  navigate
) {
  const res = await fetch(`${BASE_URL}/api/updateEvent`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event }),
  });
  const { status } = await res.json();
  if (status === "Success") navigate("/view-profile");
  else {
    setLoading(false);
    generateDangerAlert(status, setAlert, formBody);
  }
}

// Compress the Image and then upload to Firebase
async function handleImage(event, user, setAlert, formBody) {
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
          event,
          user,
          new File([compressedFile], "file", { type: "image/jpeg" })
        );
      } catch (error) {
        "Error compressing image:", error;
      }
    } else {
      generateDangerAlert(
        "Upload an image format file only",
        setAlert,
        formBody
      );
      return "false";
    }
  } else {
    generateDangerAlert("Upload an image format file only", setAlert, formBody);
    return "false";
  }
}

// Firebase Upload
async function uploadImage(event, user, image) {
  const storageRef = ref(
    storage,
    `posters/${event.event}_${user.dept}_${event.date.toString()}`
  );
  await uploadBytes(storageRef, image);
  const res = await getDownloadURL(
    ref(storage, `posters/${event.event}_${user.dept}_${event.date.toString()}`)
  );
  return res;
}

export { validateData };
