import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    open: false
}
const blockSlice = createSlice({
    name: "block_modal",
    initialState: initialState,
    reducers: {
        updateBlockModal: (state, action) => {
            state.open = action.payload
        }
    }
})

export const { updateBlockModal } = blockSlice.actions

export default blockSlice.reducer