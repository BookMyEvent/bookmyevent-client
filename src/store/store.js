import { configureStore } from "@reduxjs/toolkit";
import viewReducer from '../slice/viewSlice';
import userReducer from "../slice/userDetails";
import navSlice from '../slice/viewProfile';
import navBar from '../slice/navSlice';

const store = configureStore({
    reducer:{
        user:userReducer,
        view:viewReducer,
        nav:navSlice,
        navBar:navBar,
    }
})

export default store;