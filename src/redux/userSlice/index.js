import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: 'user',
    initialState: {
        info: null,
        getUserProgress: false,
        updateUserProgress: false,
        error: false,
    },
    reducers: {},
});

export const { getUserStart, getUserSuccess, getUserFailure } = userSlice.actions;

export const userReducer = userSlice.reducer;

export const selectCurrentUser = (state) => state.user.info;

export default userSlice;
