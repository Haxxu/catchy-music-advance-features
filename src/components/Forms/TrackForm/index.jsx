import React, { useState, useEffect } from 'react';
import Joi from 'joi';
import classNames from 'classnames/bind';
import { useNavigate, useParams } from 'react-router-dom';
import { Paper, Button } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

import FileInput from '~/components/Inputs/FileInput';
import TextField from '~/components/Inputs/TextField';
import AutoCompleteArtist from '~/components/Inputs/AutoComplete/AutoCompleteArtist';
import AutoCompleteGenre from '~/components/Inputs/AutoComplete/AutoCompleteGenre';
import { useAuth } from '~/hooks';
import axiosInstance from '~/api/axiosInstance';
import { routes } from '~/config';
import { createTrackUrl, updateTrackUrl, getTrackByIdUrl } from '~/api/urls/tracksUrls';
import styles from './styles.scoped.scss';

const cx = classNames.bind(styles);

const TrackForm = () => {
    const { userId, name } = useAuth();
    const [update, setUpdate] = useState(false);
    const [data, setData] = useState({
        name: '',
        audio: '',
        duration: 0,
        image: null,
        artists: [{ id: userId, name }],
        genres: [],
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
    };

    const handleInputState = (name, value) => {
        setData((prev) => ({ ...prev, [name]: value }));
    };

    const handleErrorState = (name, value) => {
        setErrors((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { error } = Joi.object(schema).validate(data);
        if (!error) {
            if (id === 'new-track') {
                const { data: response } = await axiosInstance.post(createTrackUrl, data);
                toast.success(response.message);
                response && navigate(routes.artist_manageTrack);
            } else {
                const { data: response } = await axiosInstance.put(updateTrackUrl(id), data);
                toast.success(response.message);
                setUpdate((prev) => !prev);
            }
        } else {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            if (id !== 'new-track') {
                const { data: res } = await axiosInstance.get(getTrackByIdUrl(id));
                setData({
                    name: res.data.name,
                    audio: res.data.audio,
                    image: res.data.image,
                    genres: res.data.genres,
                    artists: res.data.artists,
                    duration: res.data.duration,
                });
            }

            // console.log(data);
        };

        fetchData().catch(console.error);
    }, [id, update]);

    return (
        <div className={cx('container ')}>
            <Paper className={cx('form-container')}>
                <h1 className={cx('heading')}>{id === 'new-track' ? t('Add new track') : t('Edit track')}</h1>
                <form onSubmit={handleSubmit}>
                    <div className={cx('input-container')}>
                        <TextField
                            name='name'
                            label={t('Track Name')}
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
                        <AutoCompleteArtist
                            artists={data.artists}
                            handleInputState={handleInputState}
                            defaultArtist={{ name: name, id: userId }}
                            type='artist'
                            label={t('Artists')}
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
                    <Button
                        variant='contained'
                        color='secondary'
                        size='large'
                        type='submit'
                        sx={{ marginTop: '2rem', fontSize: '1.4rem', fontWeight: 700 }}
                    >
                        {id === 'new-track' ? t('Add Track') : t('Update Track')}
                    </Button>
                </form>
            </Paper>
        </div>
    );
};

export default TrackForm;
