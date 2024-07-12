import MyEvents from "./MyEvents/MyEvents";
import SideBar from "./Sidebar/SideBar";
import Profile from "./Profile/Profile";
import ViewMore from "../Home/ViewMore/ViewMore";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import "./viewProfile.css";

export default function ViewProfile() {

    const user = useSelector(store => store.user);
    const view = useSelector(store => store.view);
    const nav = useSelector(store => store.nav);

    const navigate = useNavigate();

    useEffect(() => {
        if (!(user.isAuth)) {
            navigate("/");
        }
    }, []);

    return (
        <>
            <div className={view.isActive ? 'profile-home home-inactive' : 'profile-home'}>
                {/* NavBar */}
                <SideBar />

                {/* Go Back Button */}
                <Link to="/" className="profile-go-back">
                    <span class="material-symbols-outlined profile-go-back-span">
                        arrow_back
                    </span>
                </Link>
                
                {/* My Events Tab */}
                {
                    nav.navName === 'My Events' && <MyEvents />
                }
                
                {/* Profile Tab */}
                {
                    nav.navName === 'Profile' && <Profile />
                }

            </div>

            {/* Detailed View of an Event */}
            {
                view.isActive && <ViewMore />
            }
        </>
    )
}