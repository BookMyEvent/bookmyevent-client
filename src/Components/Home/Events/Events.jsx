import { useEffect, useState } from "react";
import Loading from '../../Loading/Loading';
import './events.css'
import EventSection from "./EventSection/EventSection";

export default function Events() {

    const [upcomingEvents, setUpcoming] = useState([]);
    const [liveEvents, setLiveEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch all upcoming events
    async function fetchEvents() {
        // Fetch the event list from server
        const res = await fetch("https://bookmyeventserver.vercel.app/api/getEvents");
        const events = await res.json();
        // Sort it by date by default
        events.sort((a, b) => {
            let a1 = new Date(a.startTime);
            let b1 = new Date(b.startTime);
            return a1 - b1;
        })
        // Get today's date
        const date = new Date();
        
        let live_events = [];
        let up_events = [];
        
        events.map(item => {
            if ((date.getTime() >= new Date(item.startTime).getTime()) && (date.getTime() <= new Date(item.endTime).getTime())) {
                live_events.push(item);
            }
            else
                up_events.push(item);
        })
        // Update the states
        setUpcoming(up_events);
        setLiveEvents(live_events);
        setLoading(false)
    }


    // Initialization
    useEffect(() => {
        fetchEvents();
    }, []);

    // Loading
    if (loading) {
        return (
            <Loading />
        )
    }

    // If No event exists
    if (liveEvents.length === 0 && upcomingEvents.length === 0) {
        return (
            <div className="no-event" data-aos="fade-down">
                <h2 style={{ textAlign: "center", fontSize: "400%", color: "white" }}>STAY TUNED FOR UPDATES</h2>
            </div>
        )
    }

    // Events
    return (
        <div className="events" id="event">
            
            {/* Live Events Section */}
            {
                liveEvents.length > 0 &&  <EventSection eventData={liveEvents} name="Live Events"/>
            }

            {/* Upcoming Events Section */}
            {
                upcomingEvents.length > 0 && <EventSection eventData={upcomingEvents} name="Upcoming Events"/>
            }

        </div>
    )

}
