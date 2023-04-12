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
            return {
                comments: action.payload.comments,
                contextId: action.payload.contextId,
                contextType: action.payload.contextType,
            };
        },

        createCommentAction: (state, action) => {
            return {
                ...state,
                comments: [action.payload, ...state.comments],
            };
        },
    },
});

export const { getCommentsAction, createCommentAction } = commentSlice.actions;

export const commentReducer = commentSlice.reducer;

export default commentSlice;
