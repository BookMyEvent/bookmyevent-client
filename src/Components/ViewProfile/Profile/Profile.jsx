import React, { useState } from 'react';
import { useSelector,useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../../auth/firebase';
import { signout } from '../../../slice/userDetails';
import { signOut } from 'firebase/auth';
import { BASE_URL } from '../../../constants';
import './profile.css';
function Profile() {
    const user = useSelector(store => store.user);
    const [password, setPassword] = useState("");
    const [cpassword, setCPassword] = useState("");
    const [alert, setAlert] = useState();
    const navigate = useNavigate();
    const dispatch = useDispatch();


    async function changePassword() {
        if (password === "") {
            setAlert({
                type: "danger",
                content: "Enter the password"
            })
            return;
        }
        if (cpassword === "") {
            setAlert({
                type: "danger",
                content: "Enter the confirm password"
            })
            return;
        }
        if (password.length < 6) {
            setAlert({
                type: "danger",
                content: "Password should be atleast 6 characters"
            })
            return;
        }
        if (password != cpassword) {
            setAlert({
                type: "danger",
                content: "Enter the correct Confirm password"
            })
            return;
        }
        const res = await fetch(`${BASE_URL}/api/updatePassword`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                uid: user.uid,
                password
            })
        })
        const status = await res.json();
        if (status.type === "success") {
            await signOut(auth);
            dispatch(signout());
            navigate("/");
            return;
        }
        setAlert({
            type: status.type,
            content: status.content
        })
        setPassword("");
        setCPassword("");
    }

    return (
        <div className='profile'>
            {alert && <div className={`alert alert-${alert.type} profile-alert`}>{alert.content}</div>}
            <div className='card profile-card'>
                <div className="profile-group">
                    <label className='profile-topic'>{user.type === 'HOD' ? 'Name' : user.type === "Admin" ? "Name" : 'Club Name'}</label>
                    <label className='profile-content'>{user.name}</label>
                </div>
                <div className="profile-group">
                    <label className='profile-topic'>{user.type != 'General Club' && 'Department'}</label>
                    <label className='profile-content'>{user.dept}</label>
                </div>
                <div className="profile-group">
                    <label className='profile-topic'>Email</label>
                    <label className='profile-content'>{user.email}</label>
                </div>
                <div className="profile-password">
                    <input className='form-control change-password' type='password' placeholder='Change Password' onChange={(evt) => { setPassword(evt.target.value) }} />
                    <input className='form-control change-password' type='password' placeholder='Re Enter the Password' onChange={(evt) => { setCPassword(evt.target.value) }} />
                </div>
                <button className='btn update-password' onClick={changePassword}>Update Password</button>
            </div>
        </div>
    )
}

export default Profile