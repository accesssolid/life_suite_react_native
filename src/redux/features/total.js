import { createSlice } from '@reduxjs/toolkit';

export const totalSlice = createSlice({
    name: 'Total',
    initialState: {
        total: null
    },
    reducers: {
        GetTotal: (state, action) => {
            state.total = action.payload;
        },
    },
});

export const {GetTotal} = totalSlice.actions;

export default totalSlice.reducer;
