import { createSlice } from "@reduxjs/toolkit";

const currentLocationSlice = createSlice({
    name: "currentLocation",
    initialState: {
        current: {
            latitude: 37.78825,
            longitude: -122.4324,
        }
    },
    reducers: {
        setCurrentLocationData: (state, action) => {
            state.current = action.payload
        }
    }
})

export const { setCurrentLocationData } = currentLocationSlice.actions

export default currentLocationSlice.reducer