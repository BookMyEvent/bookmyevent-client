import { useState, useEffect, useRef } from "react";
import { signOut } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../../auth/firebase";
import { signout } from "../../../slice/userDetails";
import { changeNavState } from "../../../slice/navSlice";
import svce from "../../../Assets/SVCE.png";
import iqac from "../../../Assets/IQAC.png";
import bme from "../../../Assets/bookmyevent.png";
import Loading from "../../Loading/Loading";
import CountUp from "react-countup";
import { BASE_URL } from "../../../constants";
import "./navbar.css";

export default function NavBar() {
  const user = useSelector((store) => store.user);
  const navBar = useSelector((store) => store.navBar);
  const [active, setActive] = useState(false);
  const [menuactive, setMenuActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [eventCount, setEventCount] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 426) {
        setActive(false);
        setMenuActive(false);
      }
    };
    window.addEventListener("load", handleResize, false);
    window.addEventListener("resize", handleResize, false);
  });

  useEffect(() => {
    async function getData() {
      const data = await fetch(
        `${BASE_URL}/api/eventhistory`
      );
      const res = await data.json();
      setEventCount(res);
      setLoading(false);
    }
    getData();
  }, []);

  if (loading === true) {
    return <Loading />;
  }

  return (
    <div className="outer-nav">
      <img
        className="outer-nav-bg"
        src="https://axiesreact.themesflat.co/static/media/bg-gradient1.ea9b8bf6d8ab79c28eb0.png"
      />
      <div className="shape item-w-16"></div>
      <div className="shape item-w-50">
        <div className="shape item-w-50-inner"></div>
      </div>
      <div
        className="shape item-w-50"
        style={{ width: "70px", height: "70px", top: "55%", left: "25%" }}
      >
        <div className="shape item-w-50-inner"></div>
      </div>
      <div
        className="shape item-w-50"
        style={{ top: "50%", left: "60%" }}
      ></div>
      <div
        className="shape item-w-16"
        style={{ top: "40%", left: "40%" }}
      ></div>
      <div
        className="shape item-w-50"
        style={{ top: "80%", left: "40%", zIndex: "-1" }}
      ></div>
      <div
        className="shape item-w-50"
        style={{ top: "75%", left: "80%", zIndex: "-1" }}
      >
        <div className="shape item-w-50-inner"></div>
      </div>

      <nav className="navbar">
        <img className="icon-logo" src={svce} />

        <div className="navbar-items">
          <div
            className={`${
              navBar.navName === "Events" ? "nav-item-active" : "nav-item"
            }`}
          >
            <a
              className="d-flex justify-content-center align-items-center"
              style={{
                textDecoration: "none",
                color: "white",
              }}
              onClick={() => {
                dispatch(changeNavState("Events"));
                window.scrollTo(window.innerWidth, window.innerHeight);
              }}
              data-aos="fade-up"
            >
              Events
            </a>
          </div>

          <div
            className={`${
              navBar.navName === "Venue" ? "nav-item-active" : "nav-item"
            }`}
          >
            <a
              className="d-flex justify-content-center align-items-center"
              style={{
                textDecoration: "none",
                color: "white",
              }}
              onClick={() => {
                dispatch(changeNavState("Venue"));
                window.scrollTo(window.innerWidth, window.innerHeight);
              }}
              data-aos="fade-up"
            >
              Venues
            </a>
          </div>

          {user.isAuth ? (
            <div className="nav-item" data-aos="fade-up">
              <Link
                className="d-flex justify-content-center align-items-center"
                style={{
                  textDecoration: "none",
                  color: "white",
                }}
                onClick={() => {
                  setActive(!active);
                }}
              >
                {user.name}
                {active ? (
                  <span class="material-symbols-outlined">expand_less</span>
                ) : (
                  <span class="material-symbols-outlined">expand_more</span>
                )}
              </Link>
              <div className={`user ${!active ? "inactive" : ""}`}>
                <Link
                  to="/view-profile"
                  className="d-flex justify-content-center align-items-center view-profile"
                >
                  View Profile
                </Link>
                <Link
                  to="/pdf"
                  className="d-flex justify-content-center align-items-center pdf"
                >
                  Events Report
                </Link>
                {user.type === "Admin" && (
                  <Link
                    to="/sign-up"
                    className="d-flex justify-content-center align-items-center pdf"
                  >
                    Create Account
                  </Link>
                )}
                <button
                  className="btn btn-primary d-flex justify-content-center align-items-center signout"
                  onClick={async () => {
                    setLoading(true);
                    await signOut(auth);
                    dispatch(signout());
                    setActive(false);
                    setLoading(false);
                  }}
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <div className="nav-item">
              <Link
                to="/login"
                className="d-flex justify-content-center align-items-center"
                data-aos="fade-up"
                style={{
                  textDecoration: "none",
                  color: "white",
                }}
              >
                Login
              </Link>
            </div>
          )}
        </div>
        <img className="icon-logo" src={iqac} />
        <button className="btn menu" onClick={() => setMenuActive(!menuactive)}>
          <i
            className={`bi ${
              menuactive ? "bi-x" : "bi-list"
            } d-flex justify-content-center align-items-center`}
            style={{ color: "white" }}
          ></i>
        </button>
      </nav>

      {/* Mobile view */}

      <div className={menuactive ? `navbar-mobile-active` : "navbar-mobile"}>
        <div className="nav-mobile-logo">
          <img
            className="icon-logo"
            style={{ width: "auto", maxWidth: "70%", height: "80%" }}
            src={bme}
          />
        </div>

        <div className="nav-mobile-options">
          <Link
            className={`nav-mobile-item active d-flex justify-content-center align-items-center ${
              navBar.navName === "Events" && "nav-item-mobile-active"
            }`}
            onClick={() => {
              dispatch(changeNavState("Events"));
              setMenuActive(false);
            }}
          >
            Events
          </Link>
          <Link
            className={`nav-mobile-item active d-flex justify-content-center align-items-center ${
              navBar.navName === "Venue" && "nav-item-mobile-active"
            }`}
            onClick={() => {
              dispatch(changeNavState("Venue"));
              setMenuActive(false);
            }}
          >
            Venues
          </Link>
          {user.isAuth ? (
            <a
              className="nav-mobile-item btn d-flex justify-content-center align-items-center"
              onClick={() => {
                setActive(!active);
              }}
            >
              {user.name}
              <i
                className={`fa-solid ${
                  active ? "fa-caret-up" : "fa-caret-down"
                } d-flex justify-content-center align-items-center`}
                style={{
                  width: "20%",
                }}
              ></i>
            </a>
          ) : (
            <Link
              to="/login"
              className="nav-mobile-item btn d-flex justify-content-center align-items-center"
            >
              Login
            </Link>
          )}
        </div>
        {menuactive && (
          <div
            className={`${!active ? "user-mobile-inactive" : "user-mobile"}`}
          >
            <Link
              to="/view-profile"
              className="d-flex justify-content-center align-items-center nav-mobile-item"
              style={{ left: 0 }}
            >
              View Profile
            </Link>
            <Link
              to="/pdf"
              className="d-flex justify-content-center align-items-center nav-mobile-item"
              style={{ left: 0 }}
            >
              Events Report
            </Link>
            {user.type === "Admin" && (
              <Link
                to="/sign-up"
                className="d-flex justify-content-center align-items-center nav-mobile-item"
                style={{ left: 0 }}
              >
                Create Account
              </Link>
            )}
            <button
              className="btn btn-primary d-flex justify-content-center align-items-center nav-mobile-item"
              style={{ left: 0 }}
              onClick={async () => {
                await signOut(auth);
                dispatch(signout());
                setActive(false);
                navigate("/");
              }}
            >
              Sign out
            </button>
          </div>
        )}
      </div>

      <div className="outer-nav-contents">
        <div className="outer-nav-title" data-aos="fade-right">
          <h1 className="outer-nav-title-section">Discover SVCE</h1>
          <h1 className="outer-nav-title-section">Events</h1>
        </div>
        <div className="event-count">
          <div className="event-count-section">
            <h1 className="event-count-title" data-aos="fade-down">
              Past Events
            </h1>
            <h2 className="event-count-no" data-aos="fade-up">
              <CountUp duration={5} end={eventCount.past} />
            </h2>
          </div>
          <div className="event-count-section">
            <h1 className="event-count-title" data-aos="fade-down">
              Live Events
            </h1>
            <h2 className="event-count-no" data-aos="fade-up">
              <CountUp duration={5} end={eventCount.live} />
            </h2>
          </div>
          <div className="event-count-section">
            <h1 className="event-count-title" data-aos="fade-down">
              Upcoming Events
            </h1>
            <h2 className="event-count-no" data-aos="fade-up">
              <CountUp duration={5} end={eventCount.upcoming} />
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}
