import React, { useEffect, useRef, useState } from "react";
import data from "./data.json";
import { useDispatch, useSelector } from "react-redux";
import { addMailId, removeMailId, setFlag,setAttachments } from "../../slice/mailSlice";

const mail_ids = data;

function ChatBotMail({ disable }) {
  const mail = useSelector((store) => store.mail);
  const dispatch = useDispatch();

  return (
    <>
      <div className="chatbot-mail-section">
        <input
          type="checkbox"
          name="mail"
          disabled={disable}
          onChange={() => {
            dispatch(setFlag());
          }}
        />
        <p>Would you like to send invitation to students via Chatbot</p>
      </div>

      {mail.flag && (
        <>
          <div className="note">
            <h5>Note:</h5>
            <h6>Mail subject will be your event title</h6>
            <h6>Mail content will be your event description</h6>
            <h6>Event Poster will be sent by default</h6>
          </div>
          <div className="mail-id-groups">
            {/* Year Wise */}
            {Object.keys(mail_ids).map((group) => (
              <EachYear year={group} />
            ))}
          </div>
          <div className="attachments">
            <h6>Attachment documents to mail other than poster,if any</h6>
            <input type="file" className="form-control mail-attachment" multiple onChange={(evt)=>{dispatch(setAttachments(evt.target.files))}} />
          </div>
        </>
      )}
    </>
  );
}

function EachYear({ year }) {
  const [mainChecked, setMainChecked] = useState(false);
  const [checkList, setCheckList] = useState({});

  const dispatch = useDispatch();

  // Handle the main checkbox change
  const handleMainCheckboxChange = (e) => {
    const isChecked = e.target.checked;
    setMainChecked(isChecked);
    const temp = {};
    for (const dept of mail_ids[year]) {
      temp[Object.keys(dept)[0]] = isChecked;
      if (isChecked) dispatch(addMailId(Object.values(dept)[0]));
      else dispatch(removeMailId(Object.values(dept)[0]));
    }
    setCheckList(temp);
  };

  // Handle individual checkbox changes
  const handleIndividualCheckboxChange = (e) => {
    const { name, checked } = e.target;
    // Update the individual checkbox state
    setCheckList((prev) => ({
      ...prev,
      [name]: checked,
    }));
    if (checked) {
      for (const item of mail_ids[year]) {
        if (Object.keys(item)[0] == name) {
          dispatch(addMailId(Object.values(item)[0]));
          return;
        }
      }
    } else {
      for (const item of mail_ids[year]) {
        if (Object.keys(item)[0] == name) {
          dispatch(removeMailId(Object.values(item)[0]));
          return;
        }
      }
    }
  };

  useEffect(() => {
    const temp = {};
    for (const dept of mail_ids[year]) {
      temp[Object.keys(dept)[0]] = false;
    }
    setCheckList(temp);
  }, []);

  useEffect(() => {
    const allChecked = Object.values(checkList).every(Boolean); // If all individual checkboxes are checked
    setMainChecked(allChecked); // Set mainChecked to true if all are checked
  }, [checkList]);

  return (
    <>
      <div className="year-section">
        <div className="year-section-header">
          <input
            type="checkbox"
            checked={mainChecked}
            onChange={handleMainCheckboxChange}
          />
          <p>{year}</p>
        </div>
        {/* Individual Department Mail ID */}
        <div className="year-section-sub-mails">
          {Object.keys(checkList).map((dept) => {
            return (
              <div className="dept-mail">
                <input
                  type="checkbox"
                  name={dept}
                  checked={checkList[dept]}
                  onChange={handleIndividualCheckboxChange}
                />
                <p>{dept}</p>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default ChatBotMail;
