import { createSlice } from '@reduxjs/toolkit'

const providerSlice = createSlice({
    name: "provider",
    initialState: {
        myJobs: []
    },
    reducers: {
        setMyJobs: (state, action) => {
            state.myJobs = action.payload.data
        },
    }
})

export const { setMyJobs } = providerSlice.actions

export default providerSlice.reducer