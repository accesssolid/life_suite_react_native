import { createSlice } from '@reduxjs/toolkit'

const  initialState= {
    list: []
}

const providerSlice = createSlice({
    name: "chat_users",
    initialState:initialState,
    reducers: {
        setListChatUsers: (state, action) => {
            state.list = action.payload.data
        },
        clearListChatUsers:(state,action)=>{
            return initialState
        }
    }
})

export const { setListChatUsers ,clearListChatUsers} = providerSlice.actions

export default providerSlice.reducer