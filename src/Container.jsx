import { updatePassword } from "firebase/auth";
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux";
import { auth } from "./auth/firebase";
import { signedin } from "./slice/userDetails";
import Loading from "./Components/Loading/Loading";

function Container({ children }) {

    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();

    async function getUserDetails(uid) {
        const user = await fetch("https://bookmyeventserver.vercel.app/api/findUser", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ uid: uid })
        });
        const data = await user.json();
        dispatch(signedin(data));
        setLoading(false);
    }

    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            if (user) {
                getUserDetails(user.uid)
            }
            else {
                setLoading(false);
            }
        })
    }, []);

    if (loading) {
        return (
            <Loading />
        )
    }

    return (
        children
    )

}

export default Container;