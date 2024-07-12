import { useSelector } from "react-redux";
import AddEvent from "./AddEvent/AddEvent";
import Events from "./Events/Events";
import NavBar from "./NavBar/NavBar";
import ViewMore from "./ViewMore/ViewMore";
import Venue from "./Venue/Venue";
import Footer from "./Footer/Footer";
import "./home.css";

function Home() {
  const view = useSelector((store) => store.view);
  const navBar = useSelector((store) => store.navBar);

  return (
    <>
      <div className={`${view.isActive ? "home-inactive" : ""}`}>
        <NavBar />
        {(navBar.navName === "Events" || navBar.navName === "Home") && (
          <Events />
        )}
        {navBar.navName === "Venue" && <Venue />}
        <Footer />
        <AddEvent />
      </div>
      {view.isActive && <ViewMore />}
    </>
  );
}
export default Home;
