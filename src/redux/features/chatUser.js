import { createSlice } from '@reduxjs/toolkit'

const providerSlice = createSlice({
    name: "chat_users",
    initialState: {
        list: []
    },
    reducers: {
        setListChatUsers: (state, action) => {
            state.list = action.payload.data
        },
    }
})

export const { setListChatUsers } = providerSlice.actions

export default providerSlice.reducer