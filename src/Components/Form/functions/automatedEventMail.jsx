import { storage } from "../../../auth/firebase";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { CHATBOT_BASE_URL } from "../../../constants";

// Send Mail to Students
async function sendMail(event, mail, user) {
  const to_mail_ids = mail.mail_id.join(",");
  let attachments = await uploadAttachments(event, user, mail.attachments);

  attachments.unshift({
    filename: "Poster.png",
    path: event.image,
  });
  const data = {
    subject: event.event,
    content: event.description,
    to: to_mail_ids,
    cc: user.email,
    attachments,
  };
  const res = await fetch(`${CHATBOT_BASE_URL}/api/sendMail`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...data,
    }),
  });

  await res.json();
  return;
}

// Firebase Upload
async function uploadAttachments(event, user, files) {
  let attachments = [];
  files = Array.from(files);
  let index = 0;
  for (let file of files) {
    index++;
    const storageRef = ref(
      storage,
      `mail/${event.event}_${user.dept}_${event.date.toString()}_${index}`
    );
    await uploadBytes(storageRef, file);
    const res = await getDownloadURL(
      ref(
        storage,
        `mail/${event.event}_${user.dept}_${event.date.toString()}_${index}`
      )
    );
    attachments.push({
      filename: file.name,
      path: res,
    });
  }
  return attachments;
}

export {sendMail,uploadAttachments}