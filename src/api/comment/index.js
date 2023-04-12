import axiosInstance from '~/api/axiosInstance';
import { createCommentUrl, getCommentsUrl } from '~/api/urls/commentsUrl';
import { createCommentAction, getCommentsAction } from '~/redux/commentSlice';
import { updateCommentState } from '~/redux/updateStateSlice';

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
    }
};

export const createComment = async (dispatch, data) => {
    try {
        // console.log(data);
        const res = await axiosInstance.post(createCommentUrl(), data);
        await dispatch(createCommentAction(res.data.data));
        return res.data.data;
    } catch (error) {
        console.log(error);
    }
};
