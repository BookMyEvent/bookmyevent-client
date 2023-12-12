import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import { resetView } from '../../slice/viewSlice';

import './viewmore.css';

export default function ViewMore() {

    const _id = useSelector(store => store.view._id);
    const user = useSelector(store => store.user);
    const [event, setEvent] = useState();
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();

    async function fetchEvent() {
        const res = await fetch("https://bookmyeventserver.vercel.app/api/retrieveEvent", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ _id })
        });
        const data = await res.json();
        setEvent(data.event);
        setLoading(false);
    }

    useEffect(() => {
        fetchEvent();
    }, [])

    if (!loading) {
        return (
            <div className="view-more">
                <div className="view-card">
                    <button className="btn close-view" onClick={
                        () => {
                            dispatch(resetView());
                        }
                    }><span className="material-symbols-outlined" style={{ width: "fit-content", color: "white" }}>
                            close
                        </span></button>
                    <img src={event.image} className="view-image" />
                    <div className="view-body">
                        <h2 className="event-title" data-aos="fade-right">{event.event}</h2>
                        <p className="event-details" data-aos="fade-left" style={{ textAlign: "justify" }}>{event.description}</p>
                        <h2 className="event-details-title" data-aos="fade-right">Date & Time</h2>
                        <label className="event-details" data-aos="fade-left">{new Date(event.startTime).toLocaleString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })} - {new Date(event.endTime).toLocaleString(undefined, { hour: '2-digit', minute: '2-digit' })}</label>
                        <h2 className="event-details-title" data-aos="fade-right">Venue</h2>
                        <label className="event-details" data-aos="fade-left">{event.venue != "OTHERS**" ? event.venue : event.venueName}</label>
                        
                        {
                            (event.club != "false") &&
                            <>
                                <h2 className="event-details-title" data-aos="fade-right">Organized by</h2>
                                <label className="event-details" data-aos="fade-left">{event.club}</label>
                            </>
                        }
                        {
                            (event.department != "false") &&
                            <>
                                <h2 className="event-details-title" data-aos="fade-right">Department</h2>
                                <label className="event-details" data-aos="fade-left">{event.department}</label>
                            </>
                        }
                        <h2 className="event-details-title" data-aos="fade-right">Target Audience</h2>
                        <label className="event-details" data-aos="fade-left">
                            <ul>
                                {
                                    event.target.map((item, index) => {
                                        return <li key={index}>
                                            {item}
                                        </li>
                                    })
                                }
                            </ul>
                        </label>
                        {
                            event.link &&
                            <a href={event.link} className="btn btn-primary event-link" target="_blank">Register now</a>
                        }
                    </div>

                </div>
            </div>
        )
    }
}