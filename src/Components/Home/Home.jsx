    import { useSelector } from "react-redux";
import AddEvent from "./AddEvent";
import Events from "./Events";
import NavBar from "./NavBar";
import ViewMore from "./ViewMore";
import './home.css';
import Venue from "./Venue";
import Footer from "./Footer";

function Home() {
    const view = useSelector(store => store.view);
    const navBar = useSelector(store => store.navBar);

    return (
        <>
            <div className={`${view.isActive ? "home-inactive" : ""}`}>
                <NavBar />
                {(navBar.navName === "Events" || navBar.navName === "Home") && <Events />}
                {navBar.navName === "Venue" && <Venue />}
                <Footer />
                <AddEvent />
            </div>
            {view.isActive && <ViewMore />}
        </>

    )
}
export default Home;