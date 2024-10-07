import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { auth } from "../../auth/firebase";
import { signedin } from "../../slice/userDetails";
import Loading from "../Loading/Loading";
import { BASE_URL } from "../../constants";
import "./signup.css";

export default function SignUp() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [dept, setDept] = useState("");
    const [department, setDepartment] = useState([]);
    const [type, setType] = useState("Admin");
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState();
    const [deptType, setDeptType] = useState();
    const options = ['Admin', 'HOD', 'Department Club', 'General Club'];

    function generateError(det) {
        setAlert({
            type: "danger",
            content: det
        })
    }

    function validateForm() {
        if (type == "") {
            generateError("Choose the type of account");
            return;
        }
        if (type != "General Club") {
            if (dept == "--Choose the Department--" || dept == "") {
                generateError("Enter your department");
                return;
            }
        }
        if (name == "") {
            generateError("Enter the name");
            return;
        }
        if (email == "") {
            generateError("Enter your email");
            return;
        }
        if (password == "") {
            generateError("Enter your Password");
            return;
        }

        createUser();
    }

    async function createUser() {
        let res = undefined;
        if (type === 'General Club')
            res = await fetch(`${BASE_URL}/api/createUser`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name, email, type, password
                })
            });
        else if (type === "Department Club" || type === "Admin")
            res = await fetch(`${BASE_URL}/api/createUser`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    dept, name, email, type, password
                })
            });
        else
            res = await fetch(`${BASE_URL}/api/createUser`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    dept, name, email, type, password, deptType
                })
            });
        const result = await res.json();
        if (result.type === "Success") {
            setAlert({
                type: "success",
                content: "Account created successfully"
            })
        }
        else {
            setAlert({
                type: "danger",
                content: result.msg
            })
        }
    }

    useEffect(() => {
        async function fetchDept() {
            const res = await fetch(`${BASE_URL}/api/allDept`);
            let { dept } = await res.json();
            let temp = { '--CHOOSE THE DEPARTMENT--': false };
            dept.sort((a, b) => {
                let a1 = a.toLowerCase();
                let b1 = b.toLowerCase();
                if (a1 < b1) {
                    return -1;
                }
                if (a1 > b1) {
                    return 1;
                }
                return 0;
            })
            for (let i of dept)
                temp[i] = false;
            setDepartment(temp);
            setLoading(false);
        }
        fetchDept();
    }, [])

    if (loading) {
        return (
            <Loading />
        )
    }

    return (
        <div className="login">
            <Link to="/" style={{textDecoration:"none",position:"fixed",top:"1%",left:"1%"}}>
                <span class="material-symbols-outlined" style={{ width: "fit-content",
                height:"auto", 
                display: "flex", justifyContent: "center", alignItems: "center",
                textDecoration:"none",
                borderRadius:"50%",
                border:"1px solid white",
                padding:"1%",
                fontSize:"xx-large",
                color:"white"}}>
                    arrow_back
                </span>
            </Link>
            {alert && <div className={`alert alert-${alert.type} error`}>{alert.content}</div>}
            <div className="card d-flex align-items-center justify-content-center login-card signup">
                <h3 className="signup-title">SIGN UP</h3>
                <select className='form-select options' onChange={(evt) => { setType(evt.target.value) }}>
                    {
                        options.map((item, index) => (
                            <option value={item} key={index}>{item}</option>
                        ))
                    }
                </select>
                <div class="input-group section-signup">
                    <div class="input-group-prepend" style={{ width: "10%" }}>
                        <span class="input-group-text login-symbol" id="basic-addon1"><i class="d-flex justify-content-center align-items-center bi bi-person signup-icon"></i></span>
                    </div>
                    {
                        type === 'Admin' ?
                            <input type="text" class="form-control login-input" placeholder='Name' onChange={(evt) => { setName(evt.target.value) }} />
                            :
                            <input type="text" class="form-control login-input" placeholder={type === 'HOD' ? 'Name' : 'Club Name'} onChange={(evt) => { setName(evt.target.value) }} />
                    }
                </div>
                {
                    type === "Admin" &&
                    <div style={{
                        width:"80%",
                        height: "10%",
                        display: "flex",
                        justifyContent: "space-around",
                        alignItems: "center",
                        border: "1px solid black",
                        borderRadius: "6px",
                        marginBottom:"2%"
                    }}>
                        <div class="input-group-prepend login-symbol h-50" style={{ width: "10%" }}>
                            <span class="input-group-text login-symbol" id="basic-addon1"><i class="d-flex justify-content-center align-items-center bi bi-buildings"></i></span>
                        </div>
                        <input type="text" class="form-control login-input h-50" placeholder="Department" onChange={(evt) => { setDept(evt.target.value) }} />
                    </div>
                }
                {
                    type == 'HOD' &&
                    <div class="input-group section-signup-hod">

                        <div style={{
                            height: "50%",
                            display: "flex",
                            justifyContent: "space-around",
                            alignItems: "center",
                            border: "1px solid black",
                            borderRadius: "6px"
                        }}>
                            <div class="input-group-prepend login-symbol h-50" style={{ width: "10%" }}>
                                <span class="input-group-text login-symbol" id="basic-addon1"><i class="d-flex justify-content-center align-items-center bi bi-buildings"></i></span>
                            </div>
                            <input type="text" class="form-control login-input h-50" placeholder="Department" onChange={(evt) => { setDept(evt.target.value) }} />
                        </div>


                        <div className="dept-radio">
                            <div style={{
                                width: '50%',
                                minWidth: "fit-content",
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <input className='form-check-input' type="radio" value="Core" name="dept-type" onChange={(evt) => { setDeptType(evt.target.value) }} />
                                <label className='form-check-label d-flex justify-content-start align-items-center ps-1'>Core</label>
                            </div>
                            <div style={{
                                width: '50%',
                                minWidth: "fit-content",
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <input className='form-check-input' type="radio" value="Non Core" name="dept-type" onChange={(evt) => { setDeptType(evt.target.value) }} />
                                <label className='form-check-label d-flex justify-content-start align-items-center ps-1'>Non Core</label>
                            </div>
                        </div>
                    </div>
                }
                {
                    type == 'Department Club' &&
                    <select className='form-select section-signup login-symbol' value={dept} onChange={(evt) => { setDept(evt.target.value); }}>
                        {
                            Object.keys(department).map((item, index) => {
                                return (
                                    <option value={item} key={index} className="login-symbol">{item}</option>
                                )
                            })
                        }
                    </select>
                }
                <div class="input-group section-signup">
                    <div class="input-group-prepend login-symbol" style={{ width: "10%" }}>
                        <span class="input-group-text login-symbol" id="basic-addon1"><i class="d-flex justify-content-center align-items-center bi bi-envelope signup-icon"></i></span>
                        
                    </div>
                    <input type="text" class="form-control login-input w-75" placeholder="Email" onChange={(evt) => { setEmail(evt.target.value) }} />
                </div>

                <div class="input-group section-signup">
                    <div class="input-group-prepend login-symbol" style={{ width: "10%" }}>
                        <span class="material-symbols-outlined d-flex align-items-center justify-content-center">
                            lock
                        </span>
                    </div>
                    <input type="password" class="form-control login-input w-75" placeholder="Password" onChange={(evt) => { setPassword(evt.target.value) }} />
                </div>

                <button className="btn d-flex justify-content-around align-items-center section-signup" onClick={validateForm} style={{
                    borderRadius: "50px",
                    fontWeight: "bold"
                }}>CREATE ACCOUNT</button>
            </div>
        </div>

    )
}