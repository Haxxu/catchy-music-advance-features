import { createSlice } from '@reduxjs/toolkit';

const socketSlice = createSlice({
    name: 'socket',
    initialState: {
        socket: null,
    },
    reducers: {
        setSocketAction: (state, action) => {
            return {
                ...state,
                socket: action.payload,
            };
        },
    },
});

export const { setSocketAction } = socketSlice.actions;

export const socketReducer = socketSlice.reducer;

export default socketSlice;
