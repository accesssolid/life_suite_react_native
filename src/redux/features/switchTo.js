import {createSlice} from '@reduxjs/toolkit'
 
const switchSlice=createSlice({
    name:"switch",
    initialState:{switched:false},
    reducers:{
        changeSwitched:(state,action)=>{
            state.switched=action.payload
        }
    }

})

export const {changeSwitched}=switchSlice.actions

export default switchSlice.reducer