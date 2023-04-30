import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
    name: 'notification',
    initialState: {
        notifications: [],
        newNotifications: 0,
    },
    reducers: {
        fetchNotificationsAction: (state, action) => {
            return {
                ...state,
                notifications: action.payload,
            };
        },

        setNewNotifications: (state, action) => {
            return {
                ...state,
                newNotifications: action.payload,
            };
        },

        addNewNotifications: (state, action) => {
            return {
                ...state,
                notifications: [action.payload, ...state.notifications],
                newNotifications: state.newNotifications + 1,
            };
        },
    },
});

export const { fetchNotificationsAction, setNewNotifications, addNewNotifications } = notificationSlice.actions;

export const notificationReducer = notificationSlice.reducer;

export default notificationSlice;
