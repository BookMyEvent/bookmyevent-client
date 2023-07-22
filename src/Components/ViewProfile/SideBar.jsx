import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { changeNavState } from '../../slice/viewProfile';
import { auth } from '../../auth/firebase';
import { useNavigate, Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { signout } from '../../slice/userDetails';
import bme from "../../Assets/bookmyevent.png";
import svce from "../../Assets/SVCE.png";
import iqac from "../../Assets/IQAC.png";
import './sidebar.css';

function SideBar() {
  const navBar = useSelector(store => store.nav)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [menuactive, setMenuActive] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 426) {
        setActive(false);
        setMenuActive(false);
      }
    }
    window.addEventListener("load", handleResize, false);
    window.addEventListener("resize", handleResize, false);
  });

  return (
    <div className='sidebar'>
      <img className='icon-logo' src={svce} />

      <div className="navbar-items">

        <div className={`${navBar.navName === "Profile" ? "nav-item-active" : "nav-item"}`}>
          <a className='d-flex justify-content-center align-items-center'
            style={{
              textDecoration: 'none',
              color: 'white'
            }}
            onClick={() => {
              dispatch(changeNavState('Profile'));
            }}
            data-aos="fade-up"
          >Profile</a>
        </div>

        <div className={`${navBar.navName === "My Events" ? "nav-item-active" : "nav-item"}`}>
          <a className='d-flex justify-content-center align-items-center'
            style={{
              textDecoration: 'none',
              color: 'white'
            }}
            onClick={() => {
              dispatch(changeNavState('My Events'));
            }}
            data-aos="fade-up"
          >Events</a>
        </div>

        <div className="nav-item">
          <a className='d-flex justify-content-center align-items-center'
            style={{
              textDecoration: 'none',
              color: 'white'
            }}
            onClick={async () => {
              await signOut(auth);
              dispatch(signout());
              navigate("/")
            }}
            data-aos="fade-up"
          >Logout</a>
        </div>

      </div>
      <img className='icon-logo' src={iqac} />

      <button className='btn menu' onClick={() => setMenuActive(!menuactive)}>
        <i className={`bi ${menuactive ? 'bi-x' : 'bi-list'} d-flex justify-content-center align-items-center`} style={{color:"white" }}></i>
      </button>




      {/* Mobile view */}


      <div className={menuactive ? `navbar-mobile-active` : 'navbar-mobile'}>
        <div className="nav-mobile-logo">
          <img className='icon-logo' style={{width:"auto",maxWidth:"70%",height:"80%"}} src={bme}/>
        </div>

        <div className="nav-mobile-options">
          <Link className={`nav-mobile-item active d-flex justify-content-center align-items-center ${navBar.navName === 'Profile' && 'nav-item-mobile-active'}`}
            onClick={() => {
              dispatch(changeNavState('Profile'));
              setMenuActive(false);
            }}
          >Profile</Link>
          <Link className={`nav-mobile-item active d-flex justify-content-center align-items-center ${navBar.navName === 'My Events' && 'nav-item-mobile-active'}`}
            onClick={
              () => {
                dispatch(changeNavState('My Events'));
                setMenuActive(false);
              }
            }

          >My Events</Link>
          <button className='btn btn-primary d-flex justify-content-center align-items-center nav-mobile-item'
            style={{
              height:"auto",
              marginTop: "4%",
              color:"white",
            }}
            onClick={async () => {
              await signOut(auth);
              dispatch(signout());
              setActive(false);
              navigate("/")
            }}>SIGN OUT</button>
        </div>
      </div>

    </div>
  )
}

export default SideBar