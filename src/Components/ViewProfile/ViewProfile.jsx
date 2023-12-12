import MyEvents from "./MyEvents";
import SideBar from "./SideBar";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Profile from "./Profile";
import ViewMore from "../Home/ViewMore";

export default function ViewProfile() {

    const user = useSelector(store => store.user);
    const view = useSelector(store => store.view);
    const nav = useSelector(store => store.nav)
    const navigate = useNavigate();

    useEffect(() => {
        if (!(user.isAuth)) {
            navigate("/");
        }
    }, []);

    return (
        <>
            <div className={view.isActive && "home-inactive"} style={{
                height: "auto",
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
            }} >
                <SideBar />
                <Link to="/" style={{ width:"20%",height:"auto",textDecoration: "none", position: "relative",marginTop:"2%",marginLeft:"2%" }}>
                    <span class="material-symbols-outlined" style={{
                        width: "fit-content",
                        height: "auto",
                        display: "flex", justifyContent: "center", alignItems: "center",
                        textDecoration: "none",
                        borderRadius: "50%",
                        border: "1px solid white",
                        padding: "5%",
                        fontSize: "xx-large",
                        color: "white"
                    }}>
                        arrow_back
                    </span>
                </Link>
                {
                    nav.navName === 'My Events' && <MyEvents />
                }
                {
                    nav.navName === 'Profile' && <Profile />
                }

            </div>
            {
                view.isActive && <ViewMore />
            }
        </>
    )
}