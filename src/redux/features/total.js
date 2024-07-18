import { createSlice } from '@reduxjs/toolkit';

export const totalSlice = createSlice({
    name: 'Total',
    initialState: {
        total: null,
        otherservice:[]
    },
    reducers: {
        GetTotal: (state, action) => {
            state.total = action.payload;
        },
        SetOtherservice: (state, action) => {
            state.otherservice = action.payload;
        },
    },
});

export const {GetTotal,SetOtherservice} = totalSlice.actions;

export default totalSlice.reducer;
