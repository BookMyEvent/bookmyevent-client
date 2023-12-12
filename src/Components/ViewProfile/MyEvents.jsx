import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { setView } from '../../slice/viewSlice';
import Loading from '../Loading/Loading';
import './myevents.css';

function MyEvents() {
    const user = useSelector(store => store.user);
    const [userEvents, setUserEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    async function fetchUserEvents() {
        let res = undefined
        if (user.type != "HOD")
            res = await fetch("https://bookmyeventserver.vercel.app/api/userevents", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: user.name
                })
            })
        else
            res = await fetch("https://bookmyeventserver.vercel.app/api/userevents", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    dept: user.dept
                })
            })
        const user_events = await res.json();
        user_events.sort((a, b) => {
            let a1 = new Date(a.startTime);
            let b1 = new Date(b.startTime);
            return a1 - b1;
        })
        setUserEvents(user_events);
        setLoading(false)
    }

    useEffect(() => {
        fetchUserEvents();
    }, []);

    if (loading) {
        return (
            <Loading />
        )
    }

    return (
        <div className='user-events'>
            {
                userEvents.length > 0 ?
                    <div className='upcoming'>
                        {
                            userEvents.map((item, index) => (
                                <IndividualEvent index {...item} />
                            ))
                        }
                    </div>
                    :
                    <h2 className="no-event">MAKE YOUR FIRST EVENT NOW!</h2>
            }
        </div>
    )
}

function IndividualEvent({ index, _id, image, event, date, description, startTime, endTime, venue, venueName }) {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const view = useSelector(store => store.view)
    const [flag, setFlag] = useState(false);
    const [confirm, setConifrm] = useState(false);


    async function deleteEvent() {
        const res = await fetch("https://bookmyeventserver.vercel.app/api/deleteEvent", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                _id
            })
        })
        const { status } = await res.json();
        if (status === "Success") {
            navigate("/");
        }
    }

    function setViewMore() {
        dispatch(setView({ _id }));
    }

    return (

        <div class="card-event" style={{ backgroundImage: `url(${image})` }} data-aos="zoom-in" key={index} onMouseEnter={() => { setFlag(true) }} onMouseLeave={() => { setFlag(false) }} 
        onClick={new Date(startTime).getTime() < new Date().getTime() && setViewMore}>
            <div class="event-info">
                <h3 className="event-name">{event}</h3>
                <h5 className="view-event-details"><span class="material-symbols-outlined event-icon">
                    location_on
                </span>{venue != "OTHERS**" ? venue : venueName}</h5>
                <h5 className="view-event-details"><span class="material-symbols-outlined event-icon">
                    calendar_month
                </span>{new Date(startTime).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h5>
            </div>
            {
                (flag && new Date(startTime).getTime() > new Date().getTime()) &&
                <>
                    <div className='user-event-btn'>
                        <Link to={`/edit-event/${_id}`} className='btn btn-white d-flex flex-direction-row align-items-center justify-content-center'><i className="fa-regular fa-pen-to-square d-flex flex-direction-row align-items-center justify-content-center fs-1 text-primary"></i></Link>
                        <button className='btn btn-white d-flex flex-direction-row align-items-center justify-content-center text-danger' onClick={() => { setConifrm(true) }}><i className="fa-sharp fa-regular fa-trash-can d-flex flex-direction-row align-items-center justify-content-center fs-1"></i></button>
                    </div>
                </>
            }
            {
                confirm &&
                <div className='confirm'>
                    <h2 className='confirm-title'>Are you sure you want to cancel this event</h2>
                    <div className='confirm-btn'>
                        <button className='btn btn-danger confirm-del' onClick={deleteEvent}>DELETE</button>
                        <button className='btn btn-light confirm-close' onClick={() => { setConifrm(false) }}>CLOSE</button>
                    </div>
                </div>
            }
        </div>
    )
}

export default MyEvents

