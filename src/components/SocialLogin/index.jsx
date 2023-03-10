import React from 'react';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { useDispatch } from 'react-redux';
import { googleLogin } from '~/api/auth';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const SocialLogin = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const responseGoogle = async (response) => {
        await googleLogin({ token: response.credential }, dispatch).then((isSuccess) => {
            if (isSuccess) {
                toast.success('Login successfully!');
                navigate('/');
            }
        });
    };

    return (
        <div>
            <GoogleOAuthProvider clientId={`${process.env.REACT_APP_GOOGLE_CLIENT_ID}`}>
                <GoogleLogin onSuccess={responseGoogle} onError={responseGoogle} />
            </GoogleOAuthProvider>
        </div>
    );
};

export default SocialLogin;
