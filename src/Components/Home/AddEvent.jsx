import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add"

import './addEvent.css';

export default function AddEvent() {
    const user = useSelector(store => store.user);
    return (
        <div className='add-event'>
            {
                user.isAuth && <Link className='add-event-btn' to="/add-event">
                    <Fab color="primary" variant='extended'>
                        <AddIcon />
                        Book your event
                    </Fab>
                </Link>
            }
        </div>
    );
}
