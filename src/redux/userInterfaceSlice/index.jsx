import { createSlice } from '@reduxjs/toolkit';

const userInterfaceSlice = createSlice({
    name: 'userInterface',
    initialState: {
        theme: 'light',
    },
    reducers: {
        toggleTheme: (state) => {
            state.theme = state.theme === 'light' ? 'dark' : 'light';
        },
    },
});

export const { toggleTheme } = userInterfaceSlice.actions;

export const userInterfaceReducer = userInterfaceSlice.reducer;

export const selectCurrentTheme = (state) => state.userInterface.theme;

export default userInterfaceSlice;
