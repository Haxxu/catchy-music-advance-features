import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Paper, Button } from '@mui/material';
import classNames from 'classnames/bind';
import Joi from 'joi';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

import TextField from '~/components/Inputs/TextField';
import TextArea from '~/components/Inputs/TextArea';
import { getLyricByIdUrl, createLyricUrl, updateLyricUrl } from '~/api/urls/lyricsUrl';
import axiosInstance from '~/api/axiosInstance';
import styles from './styles.scoped.scss';

const cx = classNames.bind(styles);

const LyricForm = () => {
    const { lyricId, id } = useParams();
    const [data, setData] = useState({
        track: id,
        content: '',
        nation: '',
        providedBy: '',
    });
    const [errors, setErrors] = useState({ track: id, content: '', nation: '', providedBy: '' });
    const [update, setUpdate] = useState(false);
    const navigate = useNavigate();
    const { t } = useTranslation();

    const schema = {
        track: Joi.string()
            .required()
            .label('Track'),
        content: Joi.string()
            .required()
            .label('Content'),
        nation: Joi.string()
            .required()
            .label('Nation'),
        providedBy: Joi.string().label('ProvidedBy'),
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
            if (lyricId === 'new-lyric') {
                const { data: response } = await axiosInstance.post(createLyricUrl, data);
                toast.success(response.message);
                response && navigate(-1);
            } else {
                const { data: response } = await axiosInstance.put(updateLyricUrl(lyricId), data);
                toast.success(response.message);
                setUpdate((prev) => !prev);
            }
        } else {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            if (lyricId !== 'new-lyric') {
                const { data: res } = await axiosInstance.get(getLyricByIdUrl(lyricId));
                setData({
                    track: res.data.track,
                    content: res.data.content,
                    nation: res.data.nation,
                    providedBy: res.data.providedBy,
                });
            }

            // console.log(data);
        };

        fetchData().catch(console.error);
    }, [lyricId, update, id]);

    return (
        <div className={cx('container ')}>
            <Paper className={cx('form-container')}>
                <h1 className={cx('heading')}>{lyricId === 'new-lyric' ? t('Add new lyric') : t('Edit lyric')}</h1>
                <form onSubmit={handleSubmit}>
                    <div className={cx('input-container')}>
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
                        <TextArea
                            name='content'
                            label={t('Content')}
                            handleInputState={handleInputState}
                            handleErrorState={handleErrorState}
                            schema={schema.content}
                            error={errors.content}
                            value={data.content}
                            required={true}
                            rows='100'
                        />
                    </div>
                    <div className={cx('input-container')}>
                        <TextField
                            name='providedBy'
                            label={t('Provided By')}
                            handleInputState={handleInputState}
                            handleErrorState={handleErrorState}
                            schema={schema.providedBy}
                            error={errors.providedBy}
                            value={data.providedBy}
                            required={true}
                        />
                    </div>
                    <Button
                        variant='contained'
                        color='secondary'
                        size='large'
                        type='submit'
                        sx={{ marginTop: '2rem', fontSize: '1.4rem', fontWeight: 700, marginRight: '10px' }}
                    >
                        {lyricId === 'new-lyric' ? t('Add Lyric') : t('Update Lyric')}
                    </Button>
                    <Button
                        variant='contained'
                        color='secondary'
                        size='large'
                        sx={{ marginTop: '2rem', fontSize: '1.4rem', fontWeight: 700 }}
                        onClick={() => navigate(-1)}
                    >
                        {t('Back')}
                    </Button>
                </form>
            </Paper>
        </div>
    );
};

export default LyricForm;
