import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isAuth: false,
    id: "",
    name: "",
    email: "",
    uid: '',
    dept: '',
    type: ''
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        signedin(state, action) {
            state.id = String(action.payload._id);
            state.name = action.payload.name;
            state.email = action.payload.email;
            state.uid = action.payload.uid;
            state.type = action.payload.type;
            if (action.payload.department)
                state.dept = action.payload.department;
            state.isAuth = true;
        },
        signout(state, action) {
            state.id = "";
            state.name = "";
            state.email = "";
            state.uid = "";
            state.dept = "";
            state.type = "";
            state.isAuth = false;
        }
    }
})

export const { signedin, signout } = userSlice.actions
export default userSlice.reducer;