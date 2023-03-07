import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        token: null,
        isFetching: false,
        error: false,
    },
    reducers: {
        loginStart: (state) => {
            state.isFetching = true;
        },
        loginSuccess: (state, action) => {
            state.token = action.payload.token;
            state.isFetching = false;
        },
        loginFailure: (state) => {
            state.error = true;
            state.isFetching = false;
        },
        logout: (state) => {
            state.token = null;
            state.isFetching = false;
        },
        activeStart: (state) => {
            state.isFetching = true;
        },
        activeSuccess: (state, action) => {
            state.isFetching = false;
        },
        activeFailure: (state) => {
            state.error = true;
            state.isFetching = false;
        },
    },
});

export const {
    loginStart,
    loginSuccess,
    loginFailure,
    logout,
    activeStart,
    activeSuccess,
    activeFailure,
} = authSlice.actions;

export const authReducer = authSlice.reducer;

export const selectCurrentToken = (state) => state.auth.token;
export const selectAuthFetchingStatus = (state) => state.auth.isFetching;

export default authSlice;
