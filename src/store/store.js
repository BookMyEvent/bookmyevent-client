import { configureStore } from "@reduxjs/toolkit";
import viewReducer from '../slice/viewSlice';
import userReducer from "../slice/userDetails";
import navSlice from '../slice/viewProfile';
import navBar from '../slice/navSlice';
import mailSlice from "../slice/mailSlice";

const store = configureStore({
    reducer:{
        user:userReducer,
        view:viewReducer,
        nav:navSlice,
        navBar:navBar,
        mail:mailSlice
    }
})

export default store;