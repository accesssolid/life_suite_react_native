import { createSlice } from "@reduxjs/toolkit";

const initialState={
    title:"Select Account",
    subtitle:"You do not have any active accounts.",
    buttonTitle:"Add Stripe Money",
    type:"provider",
    open:false
}
const bankSlice=createSlice({
    name:"bank_model",
    initialState:initialState,
    reducers:{
        updateBankModelData:(state,action)=>{
            return action.payload.data
        },
        clearBankModalData:(state,action)=>{
            return initialState
        }
    }
})

export const {updateBankModelData,clearBankModalData}=bankSlice.actions

export default bankSlice.reducer