import React, { useState, useEffect } from 'react';
import Joi from 'joi';
import classNames from 'classnames/bind';
import { useNavigate, useParams } from 'react-router-dom';
import { Paper, Button } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

import FileInput from '~/components/Inputs/FileInput';
import TextField from '~/components/Inputs/TextField';
import Select from '~/components/Inputs/Select';
import axiosInstance from '~/api/axiosInstance';
import { routes } from '~/config';
// import { getAlbumByIdUrl, createAlbumUrl, updateAlbumUrl } from '~/api/urls/albumsUrl';
import { createPodcastUrl, getPodcastByIdUrl, updatePodcastUrl } from '~/api/urls/podcastsUrl';
import styles from './styles.scoped.scss';
import TextArea from '~/components/Inputs/TextArea';

const cx = classNames.bind(styles);

const PodcastForm = () => {
    const [update, setUpdate] = useState(false);
    const [data, setData] = useState({
        name: '',
        description: '',
        images: [],
        image: null,
        episodes: [],
        date: '',
        month: '',
        year: '',
        // type: 'album',
        isReleased: false,
    });
    const [errors, setErrors] = useState({
        name: '',
        description: '',
        images: [],
        image: '',
        episodes: [],
        date: '',
        month: '',
        year: '',
        // type: '',
        isReleased: '',
    });
    const { t } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();

    const schema = {
        name: Joi.string()
            .required()
            .label('Name'),
        description: Joi.string()
            .allow('')
            .label('Description'),
        image: Joi.string()
            .allow('')
            .label('Image'),
        episodes: Joi.array()
            .items(Joi.object())
            .label('Episodes'),
        images: Joi.array()
            .items(Joi.string())
            .label('Image'),
        isReleased: Joi.boolean().label('Is Released'),
        date: Joi.string()
            .required()
            .label('Date'),
        month: Joi.string()
            .required()
            .label('Month'),
        year: Joi.string()
            .required()
            .label('Year'),
        // type: Joi.string()
        //     .required()
        //     .label('Type'),
    };

    // const albumTypes = [{ name: t('Album'), value: 'album' }, { name: t('Single'), value: 'single' }];

    const releaseOptions = [{ name: t('True'), value: true }, { name: t('False'), value: false }];

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
            if (id === 'new-podcast') {
                console.log(data);
                const { data: response } = await axiosInstance.post(createPodcastUrl, data);
                toast.success(response.message);
                response && navigate(routes.podcaster_managePodcast);
            } else {
                const { data: response } = await axiosInstance.put(updatePodcastUrl(id), data);
                toast.success(response.message);
                setUpdate((prev) => !prev);
            }
        } else {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            if (id !== 'new-podcast') {
                const { data: res } = await axiosInstance.get(getPodcastByIdUrl(id));
                setData({
                    name: res.data.name,
                    description: res.data.description,
                    images: res.data.images,
                    image: res.data.image,
                    date: res.data.date,
                    month: res.data.month,
                    year: res.data.year,
                    isReleased: res.data.isReleased,
                    episodes: res.data.episodes,
                });
            }
        };

        fetchData().catch(console.error);
    }, [id, update]);

    return (
        <div className={cx('container ')}>
            <Paper className={cx('form-container')}>
                <h1 className={cx('heading')}>{id === 'new-podcast' ? t('Add new podcast') : t('Edit podcast')}</h1>
                <form onSubmit={handleSubmit}>
                    <div className={cx('input-container')}>
                        <TextField
                            name='name'
                            label={t('Podcast Name')}
                            handleInputState={handleInputState}
                            handleErrorState={handleErrorState}
                            schema={schema.name}
                            error={errors.name}
                            value={data.name}
                            required={true}
                        />
                    </div>
                    <div className={cx('input-container')}>
                        <TextArea
                            name='description'
                            label={t('Description')}
                            handleInputState={handleInputState}
                            handleErrorState={handleErrorState}
                            schema={schema.description}
                            error={errors.description}
                            value={data.description}
                            required={true}
                            rows='100'
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
                    {/* <div className={cx('input-container')}>
                        <Select
                            name='type'
                            handleInputState={handleInputState}
                            label={t('Album Type')}
                            placeholder={t('Album Type')}
                            options={albumTypes}
                            value={data.type}
                            required={true}
                        />
                    </div> */}
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
                    <div className={cx('input-container')}>
                        <Select
                            name='isReleased'
                            handleInputState={handleInputState}
                            label={t('Is Released')}
                            placeholder={t('Is Released')}
                            options={releaseOptions}
                            value={data.isReleased}
                            required={true}
                        />
                    </div>
                    <Button
                        variant='contained'
                        color='secondary'
                        size='large'
                        type='submit'
                        sx={{ marginTop: '2rem', fontSize: '1.4rem', fontWeight: 700 }}
                    >
                        {id === 'new-podcast' ? t('Add Podcast') : t('Update Podcast')}
                    </Button>
                </form>
            </Paper>
        </div>
    );
};

export default PodcastForm;
