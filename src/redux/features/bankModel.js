import { createSlice } from "@reduxjs/toolkit";

const bankSlice=createSlice({
    name:"bank_model",
    initialState:{
        title:"Select Account",
        subtitle:"You do not have any active accounts.",
        buttonTitle:"Add Stripe Money",
        type:"provider",
        open:false
    },
    reducers:{
        updateBankModelData:(state,action)=>{
            return action.payload.data
        }
    }
})

export const {updateBankModelData}=bankSlice.actions

export default bankSlice.reducer