import { fetchNotificationsAction } from '~/redux/notificationSlice';
import axiosInstance from '../axiosInstance';
import { getNotificationsUrl } from '~/api/urls/me';

export const getNotifications = async (dispatch) => {
    try {
        const res = await axiosInstance.get(getNotificationsUrl());

        if (res.status === 200) {
            dispatch(fetchNotificationsAction(res.data.data));
        }
    } catch (error) {
        console.log(error);
        // toast.error('Something went wrong');
    }
};
