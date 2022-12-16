import { createSlice } from "@reduxjs/toolkit";

const favSlice=createSlice({
    name:"favsProviders",
    initialState:{list:[]},
    reducers:{
        setFavList:(state,action)=>{
            state.list=action.payload
        }
    }
})

export const {setFavList}=favSlice.actions

export default favSlice.reducer