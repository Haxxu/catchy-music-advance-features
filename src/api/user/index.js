import axios from 'axios';
import { toast } from 'react-toastify';

// import { createUserUrl } from '~/api/urls/usersUrl';
import { registerUrl } from '~/api/urls/authUrls';
import axiosInstance from '../axiosInstance';
import { getFollowingUsersUrl } from '../urls/me';
import { setFollowing } from '~/redux/userSlice';

export const createUser = async (payload) => {
    try {
        await axios.post(registerUrl, payload);
        return true;
    } catch (error) {
        if (error.response && error.response.status >= 400 && error.response.status < 500) {
            toast.error(error.response.data.message);
        } else {
            console.error(error);
            toast.error('Something went wrong!');
        }
        return false;
    }
};

export const fetchUserFollowing = async (dispatch) => {
    try {
        const res = await axiosInstance.get(getFollowingUsersUrl);
        if (res.status === 200) {
            dispatch(setFollowing(res.data.data.all));
        }
    } catch (error) {}
};
