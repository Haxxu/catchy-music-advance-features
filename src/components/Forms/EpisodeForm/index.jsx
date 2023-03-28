import React, { useState, useEffect } from 'react';
import Joi from 'joi';
import classNames from 'classnames/bind';
import { useNavigate, useParams } from 'react-router-dom';
import { Paper, Button } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

import Select from '~/components/Inputs/Select';
import FileInput from '~/components/Inputs/FileInput';
import TextField from '~/components/Inputs/TextField';
import AutoCompletePodcaster from '~/components/Inputs/AutoComplete/AutoCompletePodcaster';
import AutoCompleteGenre from '~/components/Inputs/AutoComplete/AutoCompleteGenre';
import { useAuth } from '~/hooks';
import axiosInstance from '~/api/axiosInstance';
import { routes } from '~/config';
import { createEpisodeUrl, updateEpisodeUrl, getEpisodeByIdUrl } from '~/api/urls/tracksUrls';
import styles from './styles.scoped.scss';

const cx = classNames.bind(styles);

const EpisodeForm = () => {
    const { userId, name } = useAuth();
    const [update, setUpdate] = useState(false);
    const [data, setData] = useState({
        name: '',
        audio: '',
        duration: 0,
        image: null,
        artists: [{ id: userId, name }],
        genres: [],
        date: '',
        month: '',
        year: '',
    });
    const [errors, setErrors] = useState({ name: '', audio: '', duration: '' });

    const { id } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const schema = {
        name: Joi.string()
            .min(1)
            .required()
            .label('Name'),
        audio: Joi.string()
            .required()
            .label('Audio'),
        image: Joi.string(),
        duration: Joi.number()
            .required()
            .label('Duration'),
        genres: Joi.array()
            .items(Joi.string())
            .label('Genres'),
        artists: Joi.array()
            .items(Joi.object())
            .label('Artists'),
        date: Joi.string()
            .required()
            .label('Date'),
        month: Joi.string()
            .required()
            .label('Month'),
        year: Joi.string()
            .required()
            .label('Year'),
    };

    const handleInputState = (name, value) => {
        setData((prev) => ({ ...prev, [name]: value }));
    };

    const handleErrorState = (name, value) => {
        setErrors((prev) => ({ ...prev, [name]: value }));
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { error } = Joi.object(schema).validate(data);
        if (!error) {
            if (id === 'new-episode') {
                const { data: response } = await axiosInstance.post(createEpisodeUrl, data);
                toast.success(response.message);
                response && navigate(routes.podcaster_manageEpisode);
            } else {
                const { data: response } = await axiosInstance.put(updateEpisodeUrl(id), data);
                toast.success(response.message);
                setUpdate((prev) => !prev);
            }
        } else {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            if (id !== 'new-episode') {
                const { data: res } = await axiosInstance.get(getEpisodeByIdUrl(id));
                setData({
                    name: res.data.name,
                    audio: res.data.audio,
                    image: res.data.image,
                    genres: res.data.genres,
                    artists: res.data.artists,
                    duration: res.data.duration,
                    date: res.data.date,
                    month: res.data.month,
                    year: res.data.year,
                });
            }

            // console.log(data);
        };

        fetchData().catch(console.error);
    }, [id, update]);

    return (
        <div className={cx('container ')}>
            <Paper className={cx('form-container')}>
                <h1 className={cx('heading')}>{id === 'new-episode' ? t('Add New Episode') : t('Edit Episode')}</h1>
                <form onSubmit={handleSubmit}>
                    <div className={cx('input-container')}>
                        <TextField
                            name='name'
                            label={t('Episode Name')}
                            handleInputState={handleInputState}
                            handleErrorState={handleErrorState}
                            schema={schema.name}
                            error={errors.name}
                            value={data.name}
                            required={true}
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
                    <div className={cx('input-container')}>
                        <div className={cx('input-heading')}>{t('Audio')}</div>
                        <FileInput
                            name='audio'
                            label={t('Choose audio')}
                            icon={<MusicNoteIcon />}
                            type='audio'
                            value={data.audio}
                            handleInputState={handleInputState}
                        />
                    </div>
                    <div className={cx('input-container')}>
                        <AutoCompletePodcaster
                            artists={data.artists}
                            handleInputState={handleInputState}
                            defaultArtist={{ name: name, id: userId }}
                            type='artist'
                            label={t('Podcasters')}
                        />
                    </div>
                    <div className={cx('input-container')}>
                        <AutoCompleteGenre
                            genres={data.genres}
                            handleInputState={handleInputState}
                            label={t('Genres')}
                            type='genre'
                        />
                    </div>
                    <div className={cx('date-container')}>
                        <div className={cx('input-heading')}>{t('Release Date')}</div>
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
                    <Button
                        variant='contained'
                        color='secondary'
                        size='large'
                        type='submit'
                        sx={{ marginTop: '2rem', fontSize: '1.4rem', fontWeight: 700 }}
                    >
                        {id === 'new-episode' ? t('Add Episode') : t('Update Episode')}
                    </Button>
                </form>
            </Paper>
        </div>
    );
};

export default EpisodeForm;
