import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setView } from '../../slice/viewSlice';
import Loading from '../Loading/Loading';
import './events.css'

export default function Events() {

    const [upcomingEvents, setUpcoming] = useState([]);
    const [liveEvents, setLiveEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [option, setOption] = useState("date");
    const [optionLive, setOptionLive] = useState("date");
    const [sortDept, setSortDept] = useState({});
    const [sortDeptLive, setSortDeptLive] = useState({});


    async function sortEvents(events, option, name) {

        //Date Option

        if (option === "date") {
            events.sort((a, b) => {
                let a1 = new Date(a.startTime);
                let b1 = new Date(b.startTime);
                return a1 - b1;
            })
            name === "Upcomings" ? setUpcoming(events) : setLiveEvents(events);
            return;
        }

        //Venue Option

        if (option === "venue") {
            let bookedVenues = {};
            events.map((item) => {
                if (item.venue === "OTHERS**") {
                    if (bookedVenues[item.venueName])
                        bookedVenues[item.venueName].push(item)
                    else
                        bookedVenues[item.venueName] = new Array(item);
                }
                else {
                    if (bookedVenues[item.venue])
                        bookedVenues[item.venue].push(item)
                    else
                        bookedVenues[item.venue] = new Array(item);
                }
            })
            name === "Upcomings" ? setSortDept(bookedVenues) : setSortDeptLive(bookedVenues);
            return;
        }

        let temp = {}
        let key = undefined;

        for (let item of events) {
            key = item.department != "false" ? item.department : item.club;
            if (temp[key])
                temp[key].push(item);
            else
                temp[key] = new Array(item)
        }

        key = Object.keys(temp);

        //Dept-Asc

        if (option === "dept-asc") {
            key.sort();
            let temp_obj = {};
            for (let i = 0; i < key.length; i++) {
                temp_obj[key[i]] = temp[key[i]]
            }
            name === "Upcomings" ? setSortDept(temp_obj) : setSortDeptLive(temp_obj);
        }

        //Dept-desc

        else if (option === "dept-desc") {
            key.sort((a, b) => {
                if (a > b) return -1;
                else return 1;
            })
            let temp_obj = {};
            for (let i = 0; i < key.length; i++) {
                temp_obj[key[i]] = temp[key[i]]
            }
            name === "Upcomings" ? setSortDept(temp_obj) : setSortDeptLive(temp_obj);
        }

        //Target Audience

        else {
            const res = await fetch("https://bookmyeventserver.vercel.app/api/dept")
            const { dept } = await res.json();
            let temp = {}
            for (let event of events) {
                if (event.target.includes("All")) {
                    if (temp["All"])
                        temp["All"].push(event)
                    else
                        temp["All"] = new Array(event)
                }
            }
            for (let dep of dept) {
                for (let event of events) {
                    if (event.target.includes(dep)) {
                        if (temp[dep])
                            temp[dep].push(event)
                        else
                            temp[dep] = new Array(event)
                    }
                }
            }
            name === "Upcomings" ? setSortDept(temp) : setSortDeptLive(temp);
        }


    }

    async function fetchEvents() {
        const res = await fetch("https://bookmyeventserver.vercel.app/api/getEvents", {
            headers: {
                'Access-Control-Allow-Origin': '*'
            }
        });
        const events = await res.json();

        events.sort((a, b) => {
            let a1 = new Date(a.startTime);
            let b1 = new Date(b.startTime);
            return a1 - b1;
        })
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
        setUpcoming(up_events);
        setLiveEvents(live_events);
        setLoading(false)
    }

    useEffect(() => {
        fetchEvents();
    }, []);

    useEffect(() => {
        sortEvents(upcomingEvents, option, "Upcomings")
    }, [option]);

    useEffect(() => {
        sortEvents(liveEvents, optionLive, "Live")
    }, [optionLive]);

    if (loading) {
        return (
            <Loading />
        )
    }

    if (liveEvents.length === 0 && upcomingEvents.length === 0) {
        return (
            <div className="no-event" data-aos="fade-down">
                <h2 style={{ textAlign: "center", fontSize: "400%", color: "white" }}>STAY TUNED FOR UPDATES</h2>
            </div>
        )
    }

    return (
        <div className="events" id="event">
            {
                liveEvents.length > 0 &&
                <>
                    <div className="title" data-aos="fade-down">
                        <h2 className="sub-title">Live Events</h2>
                        <div className="sort">
                            <select className="form-select option" value={optionLive} onChange={(evt) => setOptionLive(evt.target.value)}>
                                <option value="date" className="choice">Date</option>
                                <option value="dept-asc" className="choice">Department (A..Z)</option>
                                <option value="dept-desc" className="choice">Department (Z..A)</option>
                                <option value="target" className="choice">Target Students</option>
                                <option value="venue" className="choice">Venues</option>
                            </select>
                        </div>
                    </div>
                    {
                        optionLive === "date" ?
                            <div className="upcoming">
                                {
                                    liveEvents.map((item, index) => {
                                        return (
                                            <EachEvent {...item} />
                                        )
                                    })
                                }
                            </div>
                            :
                            Object.keys(sortDeptLive).map((item, index) => {
                                return (
                                    <>
                                        <h2 className="dept" data-aos="fade-down">{item}</h2>
                                        <div className="upcoming">
                                            {
                                                Object.values(sortDeptLive[item]).map((item, index) => {
                                                    return (
                                                        <EachEvent {...item} index />
                                                    )
                                                })
                                            }
                                        </div >
                                    </>
                                )
                            })
                    }
                </>
            }
            {
                upcomingEvents.length > 0 &&
                <>
                    <div className="title" data-aos="fade-down">
                        <h2 className="sub-title">Upcoming Events</h2>
                        <div className="sort">
                            <select className="form-select option" value={option} onChange={(evt) => setOption(evt.target.value)}>
                                <option value="date" className="choice">Date</option>
                                <option value="dept-asc" className="choice">Department (A..Z)</option>
                                <option value="dept-desc" className="choice">Department (Z..A)</option>
                                <option value="target" className="choice">Target Students</option>
                                <option value="venue" className="choice">Venues</option>
                            </select>
                        </div>
                    </div>
                    {
                        option === "date" ?
                            <div className="upcoming">
                                {
                                    upcomingEvents.map((item, index) => {
                                        return (
                                            <EachEvent {...item} />
                                        )
                                    })
                                }
                            </div>
                            :
                            Object.keys(sortDept).map((item, index) => {
                                return (
                                    <>
                                        <h2 className="dept" data-aos="fade-down">{item}</h2>
                                        <div className="upcoming">
                                            {
                                                Object.values(sortDept[item]).map((item, index) => {
                                                    return (
                                                        <EachEvent {...item} index />
                                                    )
                                                })
                                            }
                                        </div >
                                    </>
                                )
                            })

                    }
                </>
            }

        </div>
    )

}

function EachEvent({ _id, image, startTime, event, venue, venueName }) {
    const dispatch = useDispatch();
    function setViewMore() {
        dispatch(setView({ _id }))
    }
    return (

        <div class="card-event" style={{ backgroundImage: `url(${image})` }} onClick={setViewMore} data-aos="zoom-in">
            <div class="event-info">
                <h3 className="event-name">{event}</h3>
                <h5 className="view-event-details"><span class="material-symbols-outlined event-icon">
                    location_on
                </span>{venue != "OTHERS**" ? venue : venueName}</h5>
                <h5 className="view-event-details"><span class="material-symbols-outlined event-icon">
                    calendar_month
                </span>{new Date(startTime).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h5>
            </div>
        </div>
    )
}

