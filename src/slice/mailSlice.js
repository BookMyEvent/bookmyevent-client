import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    flag:false,
    mail_id:[],
    attachments:[]
}

const mail = createSlice({
    name:'mail',
    initialState,
    reducers:{
        addMailId(state,action){
            let mail = action.payload
            if(!state.mail_id.includes(mail))
                state.mail_id.push(mail);
        },
        removeMailId(state,action){
            let mail = action.payload;
            state.mail_id = state.mail_id.filter((id)=>(id!=mail));
        },
        setFlag(state,action){
            state.flag = !state.flag;
        },
        setAttachments(state,action){
            state.attachments = action.payload;
        }
    }
})

export const { addMailId,removeMailId,setFlag,setAttachments } = mail.actions;
export default mail.reducer;