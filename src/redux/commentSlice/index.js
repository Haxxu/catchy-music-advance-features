import { createSlice } from '@reduxjs/toolkit';

const commentSlice = createSlice({
    name: 'comments',
    initialState: {
        comments: [],
        contextId: '',
        contextType: '',
    },
    reducers: {
        getCommentsAction: (state, action) => {
            state.comments = action.payload.comments;
            state.contextId = action.payload.contextId;
            state.contextType = action.payload.contextType;
        },
    },
});

export const { getCommentsAction } = commentSlice.actions;

export const commentReducer = commentSlice.reducer;

export default commentSlice;
