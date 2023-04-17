import { createSlice } from '@reduxjs/toolkit';

const postSlice = createSlice({
    name: 'post',
    initialState: {
        posts: [],
    },
    reducers: {
        getPostsAction: (state, action) => {
            return {
                ...state,
                posts: action.payload.posts,
            };
        },

        likePostAction: (state, action) => {
            return {
                ...state,
                posts: state.posts?.map((item) =>
                    item._id === action.payload._id
                        ? { ...item, likes: action.payload.likes, updatedAt: action.payload.updatedAt }
                        : item,
                ),
            };
        },

        deletePostAction: (state, action) => {
            return {
                ...state,
                posts: state.posts.filter((item) => item._id !== action.payload._id),
            };
        },
    },
});

export const { getPostsAction, likePostAction, deletePostAction } = postSlice.actions;

export const postReducer = postSlice.reducer;

export default postSlice;
