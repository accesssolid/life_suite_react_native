import { createSlice } from "@reduxjs/toolkit";

const faqslice = createSlice({
    name: "faq",
    initialState: { list: [] },
    reducers: {
        setFAQList: (state, action) => {
            state.list = action.payload
        }
    }
})

export const {setFAQList}=faqslice.actions
export default faqslice.reducer