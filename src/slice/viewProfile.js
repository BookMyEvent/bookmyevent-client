import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    navName:"My Events"
}

const navSlice = createSlice({
    name:'navbar',
    initialState,
    reducers:{
        changeNavState(state,action){
            state.navName = action.payload
        }
    }
})

export const { changeNavState } = navSlice.actions;
export default navSlice.reducer;