import { createSlice } from "@reduxjs/toolkit";

const initialState={
    open:false
}
const signupSlice=createSlice({
    name:"signup_modal",
    initialState:initialState,
    reducers:{
        updateSignupModal:(state,action)=>{
            state.open=action.payload
        }
    }
})

export const {updateSignupModal}=signupSlice.actions

export default signupSlice.reducer