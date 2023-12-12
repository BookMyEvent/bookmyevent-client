import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    navName:"Events"
}

const navBar = createSlice({
    name:'home-navbar',
    initialState,
    reducers:{
        changeNavState(state,action){
            state.navName = action.payload
        }
    }
})

export const { changeNavState } = navBar.actions;
export default navBar.reducer;