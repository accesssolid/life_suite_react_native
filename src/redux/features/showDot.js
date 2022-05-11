import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    showDot: false
}

const dotSlice = createSlice({
    name: "dot",
    initialState: initialState,
    reducers: {
        updateDot: (state, action) => {
            state.showDot = action.payload
        }
    }
})

export const { updateDot } = dotSlice.actions

export default dotSlice.reducer