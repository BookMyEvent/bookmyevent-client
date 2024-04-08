import React, { useEffect, useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams, Link } from 'react-router-dom';
import '../Form/form.css'
import Loading from '../Loading/Loading';
import bme from "../../Assets/bookmyevent.png";
import { storage } from '../../auth/firebase';
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";


function EditEvent() {
    const user = useSelector(store => store.user);
    const navigate = useNavigate();
    const { _id } = useParams();
    const [event, setEvent] = useState({});
    const [loading, setLoading] = useState(true);

    const [alert, setAlert] = useState({
        type: "info",
        info: "Edit Your Details"
    });
    const [block, setBlock] = useState([]);
    const [audienceType, setAudienceType] = useState({});
    const [disable, setDisable] = useState(true);
    const [image, setImage] = useState("");
    const formBody = useRef();

    // const venues = [
    //     'CHOOSE A VENUE---',
    //     'MULTI PURPOSE HALL',
    //     'FUNCTION HALL',
    //     'VIDEO HALL',
    //     'LIBRARY SEMINAR HALL',
    //     'BIO TECH SEMINAR HALL',
    //     'LIBRARY CONFERENCE HALL',
    //     'OTHERS**'
    // ];

    const venues = [
        "CHOOSE A VENUE---",
        "LIBRARY SEMINAR HALL",
        "BIO TECH SEMINAR HALL",
        "LIBRARY CONFERENCE HALL",
        "OTHERS**",
      ];
      
    const sessions = ['FN', 'AN', 'EVNG', 'Full Day']
    const tsessions = ['9:00 AM-12:00 PM', '01:00 PM-04:00 PM', '04:00 PM-08:00 PM','Full Day']

    async function fetchEvents() {
        const res = await fetch("https://bookmyeventserver.vercel.app/api/retrieveEvent", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                _id
            })
        })

        const data = await res.json();
        if ((data.type === "Success") && ((user.name === data.event.club) || (user.dept === data.event.department))) {
            setEvent({ ...data.event, date: data.event.date.slice(0, 10) });
            setLoading(false);
        }
        else {
            navigate("/");
        }
    }

    async function fetchBlockDates(det1, det2) {
        if (det2 != "" && det1 != "") {
            setDisable(true)
            const result = await fetch("https://bookmyeventserver.vercel.app/api/checkDate", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    date: det1,
                    session: det2
                })
            })
            const programs = await result.json();
            let lst = programs.blocked;
            let lst1 = lst.filter((item) => {
                return item[0] != event._id;
            })
            let lst2 = lst1.map((item) => (item[1]))
            setBlock(lst2);

            if (lst2.length === 6) {
                selectRef.current.disabled = "true";
                setAlert({
                    type: "warning",
                    info: "Oops! All venues are full.You can use either your Department or others"
                })
                return;
            }
            setAlert({
                type: "success",
                info: "Venues are available"
            })
            setDisable(false);
            if (lst2.includes(event.venue))
                setEvent({ ...event, venue: "CHOOSE A VENUE---" })
        }
    }

    async function fetchDept() {
        const res = await fetch("https://bookmyeventserver.vercel.app/api/dept");
        const { dept } = await res.json();
        let temp = { 'All': false };
        dept.sort((a, b) => {
            let a1 = a.toLowerCase();
            let b1 = b.toLowerCase();
            if (a1 < b1) {
                return -1;
            }
            if (a1 > b1) {
                return 1;
            }
            return 0;
        })
        for (let i of dept) {
            if (event.target.includes(i))
                temp[i] = true;
            else
                temp[i] = false;
        }
        if ((event.target).includes("All"))
            temp['All'] = true;
        setAudienceType(temp);
        setLoading(false);
    }


    function checkDate(evt) {
        if (evt.target.type === "date") {
            /* if (new Date(evt.target.value).getTime() < new Date().getTime()) {
                generateDangerAlert("Date should start from today");
                return;
            } */
            setEvent({ ...event, date: evt.target.value });
            fetchBlockDates(evt.target.value, event.session);
        }
        else {
            setEvent({ ...event, session: evt.target.value });
            fetchBlockDates(event.date, evt.target.value);
        }
    }

    function generateDangerAlert(info) {
        setAlert({
            type: "danger",
            info: info
        });
        formBody.current.scrollIntoView();
    }

    async function validateData(evt) {
        evt.preventDefault();
        if (event.audience === 0) {
            generateDangerAlert("Enter the audience limit");
            return;
        }
        if (event.venue === "" || event.venue === "CHOOSE A VENUE---") {
            generateDangerAlert("Enter the venue");
            return;
        }
        switch (event.venue) {

            case 'LIBRARY CONFERENCE HALL':
                if (event.audience > 25) {
                    generateDangerAlert("Maximum Allowed Occupancy - 25");
                    return;
                }
                break;

            case "BIO TECH SEMINAR HALL": // Upto 80
                if (event.audience > 80) {
                    generateDangerAlert("Maximum Allowed Occupancy - 80");
                    return;
                }
                break;

            case "LIBRARY SEMINAR HALL": //Upto 80

                if (event.audience > 80) {
                    generateDangerAlert("Maximum Allowed Occupancy - 80")
                    return;
                }
                break;

            case "VIDEO HALL": //Upto 150
                if (event.audience <= 80 && (!(block.includes('BIO TECH SEMINAR HALL')))) {
                    generateDangerAlert("Bio-tech Seminar Hall is Available");
                    return;
                }
                if (event.audience <= 80 && (!(block.includes('LIBRARY SEMINAR HALL')))) {
                    generateDangerAlert("Library Seminar Hall is Available");
                    return;
                }
                if (event.audience > 150) {
                    generateDangerAlert("Maximum Allowed Occupancy - 150")
                    return;
                }
                break;

            case 'FUNCTION HALL': // Upto 200

                if (event.audience <= 60 && (!(block.includes('BIO TECH SEMINAR HALL')))) {
                    generateDangerAlert("Bio-tech Seminar Hall is Available");
                    return;
                }

                if (event.audience <= 80 && (!(block.includes('LIBRARY SEMINAR HALL')))) {
                    generateDangerAlert("Library Seminar Hall is Available");
                    return;
                }

                if (event.audience <= 150 && (!(block.includes('VIDEO HALL')))) {
                    generateDangerAlert("Video Hall is Available");
                    return;
                }

                if (event.audience > 200) {
                    generateDangerAlert("Maximum Allowed occupancies - 200");
                    return;
                }

                break;

            case "MULTI PURPOSE HALL":
                if (event.audience <= 80 && (!(block.includes('BIO TECH SEMINAR HALL')))) {
                    generateDangerAlert("Bio-tech Seminar Hall is Available");
                    return;
                }

                if (event.audience <= 80 && !(block.includes('LIBRARY SEMINAR HALL'))) {
                    generateDangerAlert("Library Seminar Hall is Available");
                    return;
                }

                if (event.audience <= 120 && !(block.includes('VIDEO HALL'))) {
                    generateDangerAlert("Video Hall is Available");
                    return;
                }

                if (event.audience <= 240 && !(block.includes('FUNCTION HALL'))) {
                    generateDangerAlert("Function Hall is Available");
                    return;
                }
                break;

            case "OTHERS**":
                if (event.venueName.trim().length === "")
                    generateDangerAlert("Enter the Venue");
                break;
        }


        switch (event.session) {
            case 'FN':
                if (Number(new Date(event.endTime).getHours()) === 12 && (Number(new Date(event.endTime).getMinutes()) > 0)) {
                    generateDangerAlert("Program should end by 12:00 PM");
                    return;
                }
                if (Number(new Date(event.endTime).getHours()) >= 13) {
                    generateDangerAlert("Program should end by 12:00 PM");
                    return;
                }
                break;
            case 'AN':
                if (Number(new Date(event.startTime).getHours()) < 13) {
                    generateDangerAlert("Program should start from atleast 1:00 PM");
                    return;
                }
                break;
            case 'EVNG':
                if (Number(startTime.split(":")[0]) < 16) {
                    generateDangerAlert("Program should start from atleast 4:00 PM");
                    return;
                }
                break;
        }
        if (Number(new Date(event.startTime).getHours()) > Number(new Date(event.endTime).getHours())) {
            generateDangerAlert("Invalid Program Timings");
            return;
        }

        if ((Number(new Date(event.startTime).getHours()) === Number(new Date(event.endTime).getHours())) && (Number(event.startTime.split(":")[1]) > Number(new Date(event.endTime).getMinutes()))) {
            generateDangerAlert("Invalid Program Timings");
            return;
        }

        if (event.event.trim() === "") {
            generateDangerAlert("Enter the Event Name");
            return;
        }
        if (event.image === "") {
            generateDangerAlert("Upload the Event Image");
            return;
        }
        if (event.description.trim() === "") {
            generateDangerAlert("Enter the Description");
            return;
        }

        let allowed = []
        for (let item in audienceType) {
            if (audienceType[item] === true)
                allowed.push(item)
        }
        event.target = allowed;

        if (event.target.length === 0) {
            generateDangerAlert("Choose the Target Audience")
            return;
        }

        if (event.target.length > 1 && event.target.includes("All")) {
            generateDangerAlert("You cannot choose department since All is selected");
            return;
        }

        if (image != "" && image != undefined) {
            const img = await handleImage();
            if(img === "false"){
                generateDangerAlert("Upload an Image Format file only");
                return;
            }
            event.image = img;
        }

        const res = await fetch("https://bookmyeventserver.vercel.app/api/updateEvent", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ event })
        })
        const { status } = await res.json();
        if (status === "Success")
            navigate("/view-profile");
        else
            generateDangerAlert(status);
    }

    async function handleImage() {
        if (image.type.includes("image/")) {
            const storageRef = ref(storage, `posters/${event.event}_${user.dept}_${event.date.toString()}`);
            await uploadBytes(storageRef, image);
            const res = await getDownloadURL(ref(storage, `posters/${event.event}_${user.dept}_${event.date.toString()}`))
            return res;
        }
        else{
            generateDangerAlert('Upload an image format file only');
            return "false";
        }
    }


    useEffect(() => {
        if (!(user.isAuth)) {
            navigate("/")
        }
        else {
            fetchEvents();
        }
    }, []);

    useEffect(() => {
        fetchDept();
        fetchBlockDates(event.date, event.session);
    }, [loading]);


    if (loading) {
        return (
            <div>
                <Loading />
            </div>
        )
    }
    return (
        <div className='form-container'>
            <Link to="/" style={{ width: "fit-content", height: "auto", textDecoration: "none", position: "fixed", top: "1%", left: "1%" }}>
                <span class="material-symbols-outlined" style={{
                    width: "fit-content",
                    height: "auto",
                    display: "flex", justifyContent: "center", alignItems: "center",
                    textDecoration: "none",
                    borderRadius: "50%",
                    border: "1px solid white",
                    padding: "30%",
                    fontSize: "xx-large",
                    color: "white"
                }}>
                    arrow_back
                </span>
            </Link>
            <div className="card form">
                <div className="card-form-img">
                    <img src={bme} className='form-logo' />
                </div>
                <div className="form-body">
                    <div className={`alert alert-${alert.type} info`} ref={formBody}>
                        {alert.info}
                    </div>

                    {/* Date */}
                    <div className="group">
                        <label className='label-group-input'>Date</label>
                        <input className='form-control inputs' type="date" min={new Date().toISOString().slice(0, 10)} value={event.date} onChange={checkDate} required />
                    </div>
                    {/* session */}
                    <div className='session' onChange={checkDate}>
                        {
                            sessions.map((item, index) => {
                                return (
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }} key={index}>
                                        <input className='form-check-input' type="radio" value={item} key={index} name="Session" checked={event.session === item ? true : false} />
                                        <label className='form-check-label d-flex justify-content-center align-items-center' style={{
                                            height: "10%",
                                        }}>{tsessions[index]}</label>
                                    </div>

                                )
                            })
                        }
                    </div>

                    {/* Audience */}
                    <div className='group'>
                        <input className='form-control group-input' type="number" placeholder='No. of Audience' min={1} value={event.audience} onChange={(evt) => { setEvent({ ...event, audience: evt.target.value }) }} required />

                        <select className='form-select group-input' value={event.venue} onChange={(evt) => {
                            if (evt.target.value != "OTHERS**")
                                setEvent({ ...event, venue: evt.target.value, venueName: "" });
                            else
                                setEvent({ ...event, venue: evt.target.value, venueName: "" });

                        }} required>
                            {
                                venues.map((item, index) => {
                                    return (
                                        <option value={item} key={index} disabled={block.includes(item) ? true : false}>{item}</option>
                                    )
                                })
                            }
                        </select>
                    </div>

                    {
                        event.venue === "OTHERS**" &&
                        <div className="other-event-group">
                            <input className='form-control' placeholder='Enter the venue*' value={event.venueName && event.venueName} onChange={(evt) => { setEvent({ ...event, venueName: evt.target.value }) }} />
                        </div>
                    }

                    {/* Name of the event */}
                    <div className='group'>
                        <input className='form-control group-input' placeholder='Name of the Event' value={event.event} onChange={(evt) => { setEvent({ ...event, event: evt.target.value }) }} required />
                        <input className='form-control group-input' type="file" onChange={(evt) => { setImage(evt.target.files[0]) }} />
                    </div>

                    {/* Description */}
                    <textarea className='form-control desc-input' placeholder='Description' value={event.description} onChange={(evt) => { setEvent({ ...event, description: evt.target.value }) }} required />

                    {/* Registration link */}
                    <input className='form-control other-event-group' placeholder='Registration Link' value={event.link} disabled={disable} onChange={(evt) => { setEvent({ ...event, link: evt.target.value }) }} />

                    {/* Target Audience */}
                    <h5 className='target'>TARGET AUDIENCE</h5>
                    <div className='checkbox' style={{
                        width: "90%",
                        height: "auto",
                        display: "flex",
                        flexDirection: "column",
                        position: "relative",
                        left: "5%",
                    }}>
                        {
                            Object.keys(audienceType).map((item) => {
                                return (
                                    <span className="checkbox-item" >
                                        <input className='checkbox-btn' type='checkbox' defaultChecked={audienceType[item] && true} disabled={disable} onChange={() => {
                                            let temp = audienceType;
                                            temp[item] = !temp[item];
                                            setAudienceType(temp);
                                        }} value={item} />
                                        <label className='checkbox-name'>{item}</label>
                                    </span>
                                )
                            })
                        }
                    </div>

                    {/* Timing */}

                    <div className='time-group'>
                        <div className="time-group-input">
                            <label className='label-group-input'>Start Time</label>
                            <input className='form-control' type="time" disabled={disable} value={`${new Date(event.startTime).getHours() < 10 ? `0${new Date(event.startTime).getHours()}` : new Date(event.startTime).getHours()}:${new Date(event.startTime).getMinutes() < 10 ? `0${new Date(event.startTime).getMinutes()}` : new Date(event.startTime).getMinutes()}`}
                                onChange={(evt) => {
                                    let temp = new Date(event.date);
                                    setEvent({ ...event, startTime: new Date(temp.getFullYear(), temp.getMonth(), temp.getDate(), evt.target.value.slice(0, 2), evt.target.value.slice(3, 5)) })
                                }} required />
                        </div>

                        <div className="time-group-input">
                            <label className='label-group-input'>End Time</label>
                            <input className='form-control' type="time" disabled={disable} value={`${new Date(event.endTime).getHours() < 10 ? `0${new Date(event.endTime).getHours()}` : new Date(event.endTime).getHours()}:${new Date(event.endTime).getMinutes() < 10 ? `0${new Date(event.endTime).getMinutes()}` : new Date(event.endTime).getMinutes()}`}
                                onChange={(evt) => {
                                    let temp = new Date(event.date);
                                    setEvent({ ...event, endTime: new Date(temp.getFullYear(), temp.getMonth(), temp.getDate(), evt.target.value.slice(0, 2), evt.target.value.slice(3, 5)) })
                                }} required />
                        </div>
                    </div>

                    <div className="group" style={{ height: "auto", padding: "5%" }}>
                        <h6>** - Represents the availablity of venue is not guarantee.</h6>
                    </div>

                    {/* Submit Button */}
                    <button className='btn btn-primary submit-btn' onClick={validateData}>UPDATE</button>
                </div>
            </div>
        </div>
    )
}

export default EditEvent