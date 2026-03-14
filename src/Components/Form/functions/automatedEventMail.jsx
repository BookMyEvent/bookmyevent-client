import { CHATBOT_BASE_URL, BASE_URL } from "../../../constants";

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

// Cloudinary Upload via Server
async function uploadAttachments(event, user, files) {
  let attachments = [];
  files = Array.from(files);
  for (let file of files) {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const uploadRes = await fetch(`${BASE_URL}/api/uploadImage`, {
        method: "POST",
        body: formData,
      });

      if (uploadRes.ok) {
        const data = await uploadRes.json();
        attachments.push({
          filename: file.name,
          path: data.url,
        });
      } else {
        console.error("Failed to upload attachment:", file.name);
      }
    } catch (err) {
      console.error("Network error uploading attachment:", err);
    }
  }
  return attachments;
}

export { sendMail, uploadAttachments }