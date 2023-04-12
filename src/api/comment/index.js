import axiosInstance from '~/api/axiosInstance';
import { getCommentsUrl } from '~/api/urls/commentsUrl';
import { getCommentsAction } from '~/redux/commentSlice';

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
