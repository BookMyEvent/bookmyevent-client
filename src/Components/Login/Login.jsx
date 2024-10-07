import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link,useNavigate } from "react-router-dom";
import { auth } from "../../auth/firebase";
import { signedin } from "../../slice/userDetails";
import Loading from '../Loading/Loading';
import { BASE_URL } from "../../constants";
import "./login.css";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [ack, setAck] = useState("");
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();


    async function fetchUser(uid) {
        const res = await fetch(`${BASE_URL}/api/findUser`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ uid })
        });
        const data = await res.json();
        dispatch(signedin(data));
        navigate("/");
    }

    async function checkAccount() {
        setAck("");
        try {
            setLoading(true)
            const res = await signInWithEmailAndPassword(auth, email.trim(), password);
            fetchUser(res.user.uid)
        }
        catch (err) {
            setLoading(false)
            setError(err.code);
        }
    }

    async function forgetpassword() {
        setError("");
        if (email.trim() === "") {
            setError("Enter the email address");
            return;
        }
        try {
            setLoading(true);
            await sendPasswordResetEmail(auth, email);
            setAck("Mail has been sent to the registered Email");
        }
        catch (err) {
            setError(err.code)
        }
        finally{
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <Loading />
        )
    }

    return (
        <div className="login">
            <Link to="/" style={{width:"fit-content",height:"auto",textDecoration:"none",position:"fixed",top:"1%",left:"1%"}}>
                <span class="material-symbols-outlined" style={{ width: "fit-content",
                height:"auto", 
                display: "flex", justifyContent: "center", alignItems: "center",
                textDecoration:"none",
                borderRadius:"50%",
                border:"1px solid white",
                padding:"30%",
                fontSize:"xx-large",
                color:"white"}}>
                    arrow_back
                </span>
            </Link>
            {error != "" && <div className="alert alert-danger error">{error}</div>}
            {ack != "" && <div className="alert alert-success error">{ack}</div>}
            <div className="card login-card">
                <h3 className="login-title">LOGIN</h3>
                <div className="input-group section-login">
                    <div className="input-group-prepend" style={{ width: "15%", height: "auto" }}>
                        <span class="input-group-text login-symbol"><i class="d-flex justify-content-center align-items-center bi bi-envelope signup-icon"></i></span>
                    </div>
                    <input type="text" className="form-control w-75 login-input" placeholder="Email" onChange={(evt) => { setEmail(evt.target.value) }} />
                </div>
                <div className="input-group section-login">
                    <div className="input-group-prepend" style={{ width: "15%", height: "auto" }}>
                        <span class="material-symbols-outlined d-flex align-items-center justify-content-center">
                            lock
                        </span>
                    </div>
                    <input type="password" className="form-control w-75 login-input" placeholder="Password" onChange={(evt) => { setPassword(evt.target.value) }} />
                </div>
                <div className="forget">
                    <button className="btn forget-password" onClick={forgetpassword}>Forgot Password?</button>
                </div>
                <button className="d-flex justify-content-around align-items-center login-btn" onClick={checkAccount}>LOGIN</button>
            </div>
        </div>

    )
}