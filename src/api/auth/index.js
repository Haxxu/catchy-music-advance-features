import axios from 'axios';
import { toast } from 'react-toastify';

import { loginStart, loginSuccess, loginFailure, activeStart, activeSuccess, activeFailure } from '~/redux/authSlice';
import { activeUrl, loginUrl, googleLoginUrl } from '~/api/urls/authUrls';

export const login = async (payload, dispatch) => {
    dispatch(loginStart());
    try {
        const { data } = await axios.post(loginUrl, payload);
        dispatch(loginSuccess({ token: data.data }));
        return true;
    } catch (error) {
        dispatch(loginFailure());
        if (error.response && error.response.status >= 400 && error.response.status < 500) {
            toast.error(error.response.data.message);
        } else {
            console.error(error);
            toast.error('Something went wrong!');
        }
        return false;
    }
};

export const googleLogin = async (payload, dispatch) => {
    dispatch(loginStart());

    try {
        const { data } = await axios.post(googleLoginUrl, payload);
        dispatch(loginSuccess({ token: data.data }));
        return true;
    } catch (error) {
        dispatch(loginFailure());
        if (error.response && error.response.status >= 400 && error.response.status < 500) {
            toast.error(error.response.data.message);
        } else {
            console.error(error);
            toast.error('Something went wrong!');
        }
        return false;
    }
};

export const activeAccount = async (payload, dispatch) => {
    dispatch(activeStart());
    try {
        await axios.post(activeUrl, payload);
        dispatch(activeSuccess());
        return true;
    } catch (error) {
        dispatch(activeFailure());
        if (error.response && error.response.status >= 400 && error.response.status < 500) {
            toast.error(error.response.data.message);
        } else {
            console.error(error);
            toast.error('Something went wrong!');
        }
        return false;
    }
};
