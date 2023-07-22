import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { changeNavState } from '../../slice/navSlice';
import "./footer.css";

function Footer() {
    const user = useSelector(store => store.user);
    const dispatch = useDispatch();

    return (
        <div className='footer'>
            <div className="footer-items" data-aos="fade-up">
                <img className='footer-img' src='https://www.svce.ac.in/wp-content/uploads/2021/12/svce-logo.png' />
                <div className="address">
                    <iframe className='maps' src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.732724159801!2d79.96767497499306!3d12.988939287327982!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a528cd0cfb6e7ab%3A0x3294da3faad96a9!2sSri%20Venkateswara%20College%20of%20Engineering%20(SVCE)!5e0!3m2!1sen!2sin!4v1684418366170!5m2!1sen!2sin" referrerpolicy="no-referrer-when-downgrade"></iframe>
                    <p className='footer-location'><i className="fa-sharp fa-solid fa-location-dot footer-loc"></i>Sri Venkateswara College of Engineering,Post Bag No.1, Pennalur Village, Chennai - Bengaluru Highways, Sriperumbudur (off Chennai) Tk. - 602 117,Tamil Nadu, India</p>
                </div>
            </div>
            <div className="footer-items contact-us" data-aos="fade-down">
                <h4 className='footer-subtitle'>CONTACT US</h4>
                <p className='footer-content'>For Queries,contact bookmyevent@svce.ac.in</p>
            </div>
            <div className="footer-items contact-us" data-aos="fade-up">
                <h4 className='footer-subtitle'>Quick Links</h4>
                <ul className='quick-links'>
                    <Link className='links' onClick={() => {
                        dispatch(changeNavState('Events'));
                        window.scrollTo({
                            top: 0,
                            behavior: "smooth"
                        })
                    }}>Events</Link>
                    <Link href="" className='links'
                        onClick={() => {
                            dispatch(changeNavState('Venue'));
                            window.scrollTo({
                                top: 0,
                                behavior: "smooth"
                            })
                        }}>Venues</Link>
                    {user.isAuth && <Link to="/add-event" className='links'>Book Your Event</Link>}
                    {user.isAuth && <Link to="/pdf" className='links'>Events Report</Link>}
                </ul>
            </div>
        </div>
    )
}

export default Footer