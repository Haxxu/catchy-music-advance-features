import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import classNames from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import Joi from 'joi';
import passwordComplexity from 'joi-password-complexity';
import { toast } from 'react-toastify';

import { selectAuthFetchingStatus } from '~/redux/authSlice';
import { createUser } from '~/api/user';
import { routes } from '~/config';
import CustomButton from '~/components/CustomButton';
import TextField from '~/components/Inputs/TextField';
import Select from '~/components/Inputs/Select';
import RadioInput from '~/components/Inputs/RadioInput';
import styles from './styles.scoped.scss';

const cx = classNames.bind(styles);

function SignUp() {
    const [data, setData] = useState({
        email: '',
        password: '',
        confirm_password: '',
        name: '',
        date: '',
        month: '',
        year: '',
        gender: '',
    });
    const [errors, setErrors] = useState({});

    const { isFetching } = useSelector(selectAuthFetchingStatus);
    const { t } = useTranslation();
    const navigate = useNavigate();

    const months = [
        { name: t('January'), value: '01' },
        { name: t('February'), value: '02' },
        { name: t('March'), value: '03' },
        { name: t('April'), value: '04' },
        { name: t('May'), value: '05' },
        { name: t('June'), value: '06' },
        { name: t('July'), value: '07' },
        { name: t('August'), value: '08' },
        { name: t('September'), value: '09' },
        { name: t('October'), value: '10' },
        { name: t('November'), value: '11' },
        { name: t('December'), value: '12' },
    ];

    const genders = ['male', 'female', 'non-binary'];

    const schema = {
        email: Joi.string()
            .email({ tlds: false })
            .required()
            .label('Email'),
        password: passwordComplexity()
            .required()
            .label('Password'),
        confirm_password: Joi.any().required(),
        name: Joi.string()
            .min(1)
            .max(100)
            .required()
            .label('Name'),
        date: Joi.string()
            .required()
            .default('1'),
        month: Joi.string()
            .required()
            .default(t('January')),
        year: Joi.string()
            .required()
            .default('2001'),
        gender: Joi.string()
            .valid('male', 'female', 'non-binary')
            .required(),
    };

    const handleInputState = (name, value) => {
        setData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleErrorState = (name, value) => {
        value === '' ? delete errors[name] : setErrors((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        if (
            Object.keys(errors).length === 0 &&
            data.email.trim() !== '' &&
            data.name.trim() !== '' &&
            data.password.trim() !== '' &&
            data.confirm_password.trim() !== '' &&
            data.date.trim() !== '' &&
            data.month.trim() !== '' &&
            data.year.trim() !== '' &&
            data.gender.trim() !== ''
        ) {
            await createUser(data).then((isSuccess) => {
                if (isSuccess) {
                    toast.success('Verify your email to active account');
                    navigate('/login');
                }
            });
        } else {
            toast.warning(t('Please fill out properly'));
        }
    };

    return (
        <div className={cx('containter')}>
            <h1 className={cx('title')}>{t('SIGN UP')}</h1>
            <form className={cx('form-container')} onSubmit={handleSignUp}>
                <div className={cx('input-container')}>
                    <TextField
                        label={t('What is your email?')}
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
                        label={t('What should we can you?')}
                        placeholder={'Enter your name'}
                        name='name'
                        value={data.name}
                        schema={schema.name}
                        error={errors.name}
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
                <div className={cx('input-container')}>
                    <TextField
                        label={t('Confirm password')}
                        placeholder={t('Repeat your password')}
                        name='confirm_password'
                        type='password'
                        value={data.confirm_password}
                        schema={schema.confirm_password}
                        error={errors.confirm_password}
                        handleInputState={handleInputState}
                        handleErrorState={handleErrorState}
                        required
                    />
                </div>
                <div className={cx('date-of-birth-container')}>
                    <p>What's your date of birth?</p>
                    <div className={cx('date-of-birth')}>
                        <div className={cx('month')}>
                            <Select
                                name='month'
                                handleInputState={handleInputState}
                                label={t('Month')}
                                placeholder='Months'
                                options={months}
                                value={data.month}
                                required={true}
                            />
                        </div>
                        <div className={cx('date')}>
                            <TextField
                                label={t('Date')}
                                placeholder='DD'
                                name='date'
                                value={data.date}
                                handleInputState={handleInputState}
                                required
                            />
                        </div>
                        <div className={cx('year')}>
                            <TextField
                                label={t('Year')}
                                placeholder='YYYY'
                                name='year'
                                value={data.year}
                                handleInputState={handleInputState}
                                required
                            />
                        </div>
                    </div>
                </div>
                <div className={cx('input-container')}>
                    <RadioInput
                        label="What's your gender?"
                        name='gender'
                        handleInputState={handleInputState}
                        options={genders}
                        fontLabelSize='1.4rem'
                        required
                    />
                </div>
                <CustomButton fullWidth onClick={handleSignUp} isFetching={isFetching} type='submit'>
                    {t('Sign Up')}
                </CustomButton>
            </form>
            <div className={cx('login-section')}>
                <h4 className={cx('title')}>{t('Have an account?')}</h4>
                <CustomButton fullWidth variant='outlined' onClick={() => navigate(routes.login)}>
                    {t('Login')}
                </CustomButton>
            </div>
        </div>
    );
}

export default SignUp;
