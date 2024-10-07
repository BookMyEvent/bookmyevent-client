import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import Loading from "../Loading/Loading";
import { Page, Text, View, Document, StyleSheet, Image } from "@react-pdf/renderer";
import { BASE_URL } from "../../constants";
import "./pdfview.css";

function PDFView() {

    const [events, setEvents] = useState([]);
    const user = useSelector(store => store.user);
    const navigate = useNavigate();
    const [windowSize, setWindowSize] = useState(window.innerWidth);
    const [loading, setLoading] = useState(true);

    async function fetchEvents() {
        const res = await fetch(`${BASE_URL}/api/allEvents`);
        const { event } = await res.json();
        setLoading(false)
        setEvents(event);
    }

    useEffect(() => {
        setWindowSize(window.innerWidth);
    })

    useEffect(() => {
        if (!(user.isAuth)) {
            navigate("/");
        }
        else {
            fetchEvents()
        }
    }, []);

    if (loading) {
        return (
            <Loading />
        )
    }

    if (events.length == 0) {
        return (
            <div>
                <h1 style={{
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}> NO EVENTS RECORD </h1>
            </div>
        )
    }

    if (windowSize > 426)
        return (
            <PDFViewer>
                <GeneratePDF events={events} />
            </PDFViewer>
        )

    else
        return (
            <>
                <Link to="/" style={{ textDecoration: "none", position: "fixed", top: "1%", left: "1%" }}>
                    <span class="material-symbols-outlined" style={{
                        width: "fit-content",
                        height: "auto",
                        display: "flex", justifyContent: "center", alignItems: "center",
                        textDecoration: "none",
                        borderRadius: "50%",
                        border: "1px solid white",
                        padding: "1%",
                        fontSize: "xx-large",
                        color: "white"
                    }}>
                        arrow_back
                    </span>
                </Link>
                <PDFDownloadLink className="btn btn-primary pdf-download" document={<GeneratePDF events={events} />} fileName="Events.pdf">
                    {({ blob, url, loading, error }) =>
                        loading ? 'Loading document...' : 'Download now!'
                    }
                </PDFDownloadLink>
            </>
        )
}

function GeneratePDF({ events }) {

    const styles = StyleSheet.create({
        page: {
            padding: 10,
            fontFamily: "Times-Roman",
            fontWeight: "bold",
        },
        header: {
            height: 80,
            borderBottomWidth: 1,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center"
        },
        img: {
            width: '12%',
            height: 60
        },
        title: {
            paddingTop: 5,
            paddingLeft: 30,
            textAlign: "center"
        },
        table: {
            width: "100%",
        },
        text: {
            width: "90%",
            height: "auto",
            minHeight: 38,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            backgroundColor: 'white',
            position: 'relative',
            left: 27,
            top: 10,
            borderColor: 'black',
            borderBottomWidth: '1px',

        },
        content: {
            width: "20%",
            display: "flex",
            textAlign: 'center',
            fontSize: '10px',
            borderColor: 'black',
            borderRightWidth: '1px',
            padding: 5,
            textTransform: "uppercase",
        },
        headerTitle: {
            fontWeight: "ultrabold"
        }
    })

    return (
        <Document >
            <Page size="A4" style={styles.page}>
                <View style={styles.header} fixed>
                    <Image src='https://upload.wikimedia.org/wikipedia/en/7/71/SVCE_logo.png' style={styles.img}></Image>
                    <View style={{ width: "80%" }}>
                        <Text style={{ fontSize: 18, textAlign: "center" }}>Sri Venkateswara College Of Engineering</Text>
                        <Text style={{ fontSize: 12, textAlign: "center" }}>(An Autonomous Institution, Affiliated to Anna University, Chennai)</Text>
                        <Text style={{ fontSize: 15, textAlign: "center" }}>Sriperumbudur Tk, Kancheepuram Dt, Tamilnadu, India - 602117</Text>
                    </View>
                </View>
                <Text style={styles.title}>Event Report for the Academic Year:{events[0].startTime.slice(0, 10).split("-")[0]} - {Number(events[events.length-1].startTime.slice(0, 10).split("-")[0])}</Text>
                <View style={styles.table}>
                    <View style={{ ...styles.text, borderTopWidth: '1px' }} fixed>
                        <Text style={{ ...styles.content, borderLeftWidth: '1px' }}>Event Name</Text>
                        <Text style={{ ...styles.content }}>Date</Text>
                        <Text style={{ ...styles.content }}>Time</Text>
                        <Text style={{ ...styles.content }}>Venue</Text>
                        <Text style={{ ...styles.content }}>Host</Text>
                    </View>
                    {
                        events.map((item, index) => {
                            let date = item.startTime.slice(0, 10).split("-");
                            let startHr = new Date(item.startTime).getHours();
                            let startMin = new Date(item.startTime).getMinutes();
                            let endHr = new Date(item.endTime).getHours();
                            let endMin = new Date(item.endTime).getMinutes()
                            return (
                                <View style={styles.text} key={index} wrap={false}>
                                    <Text style={{ ...styles.content, borderLeftWidth: '1px' }}>{item.event}</Text>
                                    <Text style={styles.content}>{`${date[2]}-${date[1]}-${date[0]}`}</Text>
                                    <Text style={styles.content}>{`${startHr < 10 ? `0${startHr}` : startHr <= 12 ? startHr : startHr % 12}:${startMin < 10 ? `0${startMin}` : startMin} ${startHr / 12 >= 1 ? 'PM' : 'AM'}`} - {` ${endHr < 10 ? `0${endHr}` : endHr <= 12 ? endHr : endHr % 12}:${endMin < 10 ? `0${endMin}` : endMin} ${endHr / 12 >= 1 ? 'PM' : 'AM'}`}</Text>
                                    <Text style={styles.content}>{item.venue != "OTHERS**" ? item.venue : item.venueName}</Text>
                                    <Text style={styles.content}>{item.club != "false" ? item.club : item.department}</Text>
                                </View>);
                        })
                    }
                </View>
            </Page>
        </Document>
    )

}

export default PDFView;