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

        updateCommentAction: (state, action) => {
            return {
                ...state,
                comments: state.comments?.map((item) =>
                    item._id === action.payload._id
                        ? { ...item, content: action.payload.content, updatedAt: action.payload.updatedAt }
                        : item,
                ),
            };
        },

        updateReplyCommentAction: (state, action) => {
            return {
                ...state,
                comments: state.comments?.map((item) =>
                    item._id === action.payload.commentRoot
                        ? {
                              ...item,
                              replyComments: item.replyComments?.map((repItem) =>
                                  repItem._id === action.payload._id
                                      ? {
                                            ...repItem,
                                            content: action.payload.content,
                                            updatedAt: action.payload.updatedAt,
                                        }
                                      : repItem,
                              ),
                          }
                        : item,
                ),
            };
        },

        replyCommentAction: (state, action) => {
            return {
                ...state,
                comments: state.comments?.map((item) =>
                    item._id === action.payload.commentRoot
                        ? {
                              ...item,
                              replyComments: [action.payload, ...item.replyComments],
                          }
                        : item,
                ),
            };
        },

        deleteCommentAction: (state, action) => {
            return {
                ...state,
                comments: state.comments.filter((item) => item._id !== action.payload._id),
            };
        },

        deleteReplyCommentAction: (state, action) => {
            return {
                ...state,
                comments: state.comments?.map((item) =>
                    item._id === action.payload.commentRoot
                        ? {
                              ...item,
                              replyComments: item.replyComments?.filter(
                                  (repItem) => repItem._id !== action.payload._id,
                              ),
                          }
                        : item,
                ),
            };
        },

        likeCommentAction: (state, action) => {
            return {
                ...state,
                comments: state.comments?.map((item) =>
                    item._id === action.payload._id
                        ? { ...item, likes: action.payload.likes, updatedAt: action.payload.updatedAt }
                        : item,
                ),
            };
        },

        likeReplyCommentAction: (state, action) => {
            return {
                ...state,
                comments: state.comments?.map((item) =>
                    item._id === action.payload.commentRoot
                        ? {
                              ...item,
                              replyComments: item.replyComments?.map((repItem) =>
                                  repItem._id === action.payload._id
                                      ? {
                                            ...repItem,
                                            likes: action.payload.likes,
                                            updatedAt: action.payload.updatedAt,
                                        }
                                      : repItem,
                              ),
                          }
                        : item,
                ),
            };
        },
    },
});

export const {
    getCommentsAction,
    createCommentAction,
    updateCommentAction,
    updateReplyCommentAction,
    replyCommentAction,
    deleteCommentAction,
    deleteReplyCommentAction,
    likeCommentAction,
    likeReplyCommentAction,
} = commentSlice.actions;

export const commentReducer = commentSlice.reducer;

export default commentSlice;
