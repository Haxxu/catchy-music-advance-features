import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: 'user',
    initialState: {
        info: null,
        getUserProgress: false,
        updateUserProgress: false,
        error: false,
        following: [],
    },
    reducers: {
        setFollowing: (state, action) => {
            return {
                ...state,
                following: action.payload,
            };
        },

        followUserAction: (state, action) => {
            if (!state.following.find((item) => item._id === action.payload._id)) {
                return {
                    ...state,
                    following: [action.payload, ...state.following],
                };
            }
        },

        unfollowUserAction: (state, action) => {
            return {
                ...state,
                following: state.following.filter((item) => item._id !== action.payload._id),
            };
        },
    },
});

export const {
    getUserStart,
    getUserSuccess,
    getUserFailure,
    setFollowing,
    followUserAction,
    unfollowUserAction,
} = userSlice.actions;

export const userReducer = userSlice.reducer;

export const selectCurrentUser = (state) => state.user.info;

export default userSlice;
