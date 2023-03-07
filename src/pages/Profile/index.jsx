import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import { Paper, Button } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import Joi from 'joi';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import TextField from '~/components/Inputs/TextField';
import FileInput from '~/components/Inputs/FileInput';
import Select from '~/components/Inputs/Select';
import RadioInput from '~/components/Inputs/RadioInput';
import AutoCompleteGenre from '~/components/Inputs/AutoComplete/AutoCompleteGenre';
import axiosInstance from '~/api/axiosInstance';
import { getCurrentUserProfileUrl } from '~/api/urls/me';
import { updateUserByIdUrl } from '~/api/urls/usersUrl';
import { useAuth } from '~/hooks';
import styles from './st;yles.scoped.scss';
import { updateUserProfileState } from '~/redux/updateStateSlice';
import { useDispatch } from 'react-redux';

const cx = classNames.bind(styles);

const Profile = () => {
    const { userId } = useAuth();
    const [update, setUpdate] = useState(false);
    const [data, setData] = useState({
        name: '',
        description: '',
        month: '',
        date: '',
        year: '',
        gender: '',
        image: '',
        nation: '',
        genres: [],
    });
    const [errors, setErrors] = useState({
        name: '',
        description: '',
        month: '',
        date: '',
        year: '',
        gender: '',
        image: '',
        nation: '',
    });
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleInputState = (name, value) => {
        setData((prev) => ({ ...prev, [name]: value }));
    };
    const handleErrorState = (name, value) => {
        setErrors((prev) => ({ ...prev, [name]: value }));
    };
    const schema = {
        name: Joi.string()
            .min(1)
            .max(100)
            .required()
            .label('Name'),
        gender: Joi.string()
            .valid('male', 'female', 'non-binary')
            .required()
            .label('Gender'),
        description: Joi.string()
            .allow('')
            .label('Description'),
        image: Joi.string()
            .allow('')
            .label('Image'),
        genres: Joi.array()
            .items(Joi.string())
            .label('Genres'),
        date: Joi.string()
            .required()
            .label('Date'),
        month: Joi.string()
            .required()
            .label('Month'),
        year: Joi.string()
            .required()
            .label('Year'),
        nation: Joi.string()
            .required()
            .label('Nation'),
    };
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { error } = Joi.object(schema).validate(data);
        if (!error) {
            const { data: response } = await axiosInstance.put(updateUserByIdUrl(userId), data);
            toast.success(response.message);
            setUpdate((prev) => !prev);
            dispatch(updateUserProfileState());
        } else {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const { data: res } = await axiosInstance.get(getCurrentUserProfileUrl);
            setData({
                name: res.data.name,
                description: res.data.description,
                month: res.data.month,
                date: res.data.date,
                year: res.data.year,
                gender: res.data.gender,
                image: res.data.image,
                nation: res.data.nation,
                genres: res.data.genres,
            });
        };

        fetchData().catch(console.error);
    }, [update]);

    return (
        <div className={cx('container')}>
            <Paper className={cx('form-container')}>
                <h1 className={cx('heading')}>{t('Edit Profile')}</h1>
                <form onSubmit={handleSubmit}>
                    <div className={cx('input-container')}>
                        <TextField
                            name='name'
                            label={t('Name')}
                            handleInputState={handleInputState}
                            handleErrorState={handleErrorState}
                            schema={schema.name}
                            error={errors.name}
                            value={data.name}
                            required={true}
                        />
                    </div>
                    <div className={cx('date-container')}>
                        <div className={cx('input-heading')}>{t('Date of birth')}</div>
                        <div className={cx('date')}>
                            <div className={cx('month')}>
                                <Select
                                    name='month'
                                    handleInputState={handleInputState}
                                    label={t('Month')}
                                    placeholder={t('Month')}
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
                        <TextField
                            name='nation'
                            label={t('Nation')}
                            handleInputState={handleInputState}
                            handleErrorState={handleErrorState}
                            schema={schema.nation}
                            error={errors.nation}
                            value={data.nation}
                            required={true}
                        />
                    </div>
                    <div className={cx('input-container')}>
                        <RadioInput
                            label={t('Gender')}
                            name='gender'
                            handleInputState={handleInputState}
                            options={genders}
                            fontLabelSize='1.4rem'
                            required
                        />
                    </div>
                    <div className={cx('input-container')}>
                        <AutoCompleteGenre
                            genres={data.genres}
                            handleInputState={handleInputState}
                            label='Genres'
                            type='genre'
                        />
                    </div>
                    <div className={cx('input-container')}>
                        <div className={cx('input-heading')}>{t('Image')}</div>
                        <FileInput
                            name='image'
                            label={t('Choose image')}
                            icon={<ImageIcon />}
                            type='image'
                            value={data.image}
                            handleInputState={handleInputState}
                        />
                    </div>
                    <Button
                        variant='contained'
                        color='secondary'
                        size='large'
                        type='submit'
                        sx={{ marginTop: '2rem', fontSize: '1.4rem', fontWeight: 700 }}
                    >
                        {t('Update Profile')}
                    </Button>
                    <Button
                        variant='contained'
                        color='secondary'
                        size='large'
                        onClick={() => navigate(-1)}
                        sx={{ marginTop: '2rem', marginLeft: '5px', fontSize: '1.4rem', fontWeight: 700 }}
                    >
                        {t('Back')}
                    </Button>
                </form>
            </Paper>
        </div>
    );
};

export default Profile;
