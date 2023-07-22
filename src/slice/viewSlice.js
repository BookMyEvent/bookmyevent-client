import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isActive: false,
    _id:""
}

const viewReducer = createSlice({
    name: 'view-more',
    initialState,
    reducers: {
        setView(state, action) {
            state.isActive = true;
            state._id = action.payload._id;
        },
        resetView(state,action){
            state.isActive = false;
            state._id = "";
        }
    }
})

export const { setView,resetView } = viewReducer.actions;
export default viewReducer.reducer;