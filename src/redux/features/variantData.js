import { createSlice } from "@reduxjs/toolkit";

const varinatSlice = createSlice({
    name: "variant",
    initialState: {
        "variant_title": "",
        "variant": "",
        "make": "",
        "model": "",
        "year": ""
    },
    reducers: {
        setVariantData: (state, action) => {
            return action.payload
        }
    }
})

export const { setVariantData } = varinatSlice.actions

export default varinatSlice.reducer