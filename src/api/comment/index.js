import { toast } from 'react-toastify';

import axiosInstance from '~/api/axiosInstance';
import {
    createCommentUrl,
    deleteCommentByIdUrl,
    getCommentsUrl,
    replyCommentUrl,
    updateCommentByIdUrl,
} from '~/api/urls/commentsUrl';
import {
    createCommentAction,
    deleteCommentAction,
    deleteReplyCommentAction,
    getCommentsAction,
    likeCommentAction,
    likeReplyCommentAction,
    replyCommentAction,
    updateCommentAction,
    updateReplyCommentAction,
} from '~/redux/commentSlice';
import { likeCommentUrl, unlikeCommentUrl } from '~/api/urls/me';

export const getComments = async (dispatch, contextId, contextType) => {
    try {
        const res = await axiosInstance.get(getCommentsUrl(), {
            params: {
                contextId,
            },
        });
        dispatch(
            getCommentsAction({
                comments: res.data.data.comments,
                contextId,
                contextType,
            }),
        );
    } catch (error) {
        console.log(error);
        toast.error('Something went wrong');
    }
};

export const createComment = async (dispatch, data) => {
    try {
        // console.log(data);
        const res = await axiosInstance.post(createCommentUrl(), data);
        if (res.status === 200) {
            dispatch(createCommentAction(res.data.data));
        }
        return res.data.data;
    } catch (error) {
        console.log(error);
        toast.error('Something went wrong');
    }
};

export const updateComment = async (dispatch, editComment, data) => {
    try {
        const res = await axiosInstance.patch(updateCommentByIdUrl(editComment._id), data);
        if (res.status === 200) {
            if (editComment.commentRoot) {
                dispatch(updateReplyCommentAction(res.data.data));
            } else {
                dispatch(updateCommentAction(res.data.data));
            }
        }
    } catch (error) {
        console.log(error);
        toast.error('Something went wrong');
    }
};

export const replyComment = async (dispatch, data) => {
    try {
        const res = await axiosInstance.post(replyCommentUrl(), data);
        if (res.status === 200) {
            dispatch(replyCommentAction(res.data.data));
        }
    } catch (error) {
        console.log(error);
        toast.error('Something went wrong');
    }
};

export const deleteComment = async (dispatch, comment) => {
    try {
        const res = await axiosInstance.delete(deleteCommentByIdUrl(comment._id));
        if (res.status === 200) {
            if (comment.commentRoot) {
                dispatch(deleteReplyCommentAction(res.data.data));
            } else {
                dispatch(deleteCommentAction(res.data.data));
            }
        }
    } catch (error) {
        console.log(error);
        toast.error('Something went wrong');
    }
};

export const likeComment = async (dispatch, comment) => {
    try {
        const res = await axiosInstance.put(likeCommentUrl(), {
            comment: comment._id,
        });

        if (res.status === 200) {
            if (comment.commentRoot) {
                dispatch(likeReplyCommentAction(res.data.data));
            } else {
                dispatch(likeCommentAction(res.data.data));
            }
        }
    } catch (error) {
        console.log(error);
        toast.error('Something went wrong');
    }
};

export const unlikeComment = async (dispatch, comment) => {
    try {
        console.log(comment);
        const res = await axiosInstance.delete(unlikeCommentUrl(), {
            data: {
                comment: comment._id,
            },
        });

        if (res.status === 200) {
            if (comment.commentRoot) {
                dispatch(likeReplyCommentAction(res.data.data));
            } else {
                dispatch(likeCommentAction(res.data.data));
            }
        }
    } catch (error) {
        console.log(error);
        toast.error('Something went wrong');
    }
};
