import React, { useState } from 'react';
import classNames from 'classnames/bind';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import Joi from 'joi';
import { useTranslation } from 'react-i18next';

import { login } from '~/api/auth';
import { selectAuthFetchingStatus } from '~/redux/authSlice';
import TextField from '~/components/Inputs/TextField';
import styles from './styles.scoped.scss';
import CustomButton from '~/components/CustomButton';
import CheckboxInput from '~/components/Inputs/CheckboxInput';
import { routes } from '~/config';

const cx = classNames.bind(styles);

function Login() {
    const [data, setData] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});

    const { isFetching } = useSelector(selectAuthFetchingStatus);
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const schema = {
        email: Joi.string()
            .email({ tlds: false })
            .required()
            .label('Email'),
        password: Joi.string()
            .required()
            .label('Password'),
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (Object.keys(errors).length === 0 && data.email.trim() !== '' && data.password.trim() !== '') {
            await login(data, dispatch).then((isSuccess) => {
                if (isSuccess) {
                    toast.success('Login successfully');
                    navigate('/');
                }
            });
        } else {
            toast.warning(t('Please fill out properly'));
        }
    };

    const handleInputState = (name, value) => {
        setData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleErrorState = (name, value) => {
        value === '' ? delete errors[name] : setErrors((prevData) => ({ ...prevData, [name]: value }));
    };

    return (
        <div className={cx('containter')}>
            <h1 className={cx('title')}>{t('LOGIN')}</h1>
            <form className={cx('form-container')} onSubmit={handleLogin}>
                <div className={cx('input-container')}>
                    <TextField
                        label={t('Email')}
                        placeholder={'Enter your email'}
                        name='email'
                        value={data.email}
                        schema={schema.email}
                        error={errors.email}
                        handleInputState={handleInputState}
                        handleErrorState={handleErrorState}
                        required
                    />
                </div>
                <div className={cx('input-container')}>
                    <TextField
                        label={t('Password')}
                        placeholder={t('Enter your password')}
                        name='password'
                        type='password'
                        value={data.password}
                        schema={schema.password}
                        error={errors.password}
                        handleInputState={handleInputState}
                        handleErrorState={handleErrorState}
                        required
                    />
                </div>
                <div className={cx('password-actions')}>
                    <CheckboxInput label={t('Remember my password')} size='large' labelFontSize='1.3rem' />
                    <Link className='forget-password' to='/forgot-password'>
                        {t('Forgot your password?')}
                    </Link>
                </div>
                <CustomButton fullWidth onClick={handleLogin} isFetching={isFetching} type='submit'>
                    {t('Login')}
                </CustomButton>
            </form>
            <div className={cx('signup-section')}>
                <h4 className={cx('title')}>{t("Doesn't have an account?")}</h4>
                <CustomButton fullWidth variant='outlined' onClick={() => navigate(routes.signup)}>
                    {t('Sign Up')}
                </CustomButton>
            </div>
        </div>
    );
}

export default Login;
