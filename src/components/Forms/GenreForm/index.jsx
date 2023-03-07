import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import Joi from 'joi';
import { toast } from 'react-toastify';
import { Button, Paper } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';

import styles from './styles.scoped.scss';
import axiosInstance from '~/api/axiosInstance';
import { createGenreUrl, updateGenreUrl, getGenreByIdUrl } from '~/api/urls/genresUrl';
import { routes } from '~/config';
import TextField from '~/components/Inputs/TextField';
import FileInput from '~/components/Inputs/FileInput';
import { useTranslation } from 'react-i18next';

const cx = classNames.bind(styles);

const GenreForm = () => {
    const [update, setUpdate] = useState(false);
    const [data, setData] = useState({
        name: '',
        description: '',
        image: null,
    });
    const [errors, setErrors] = useState({ name: '', description: '' });

    const { id } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const schema = {
        name: Joi.string()
            .required()
            .label('Name'),
        description: Joi.string().label('Description'),
        image: Joi.string().label('Image'),
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
            if (id === 'new-genre') {
                const { data: response } = await axiosInstance.post(createGenreUrl, data);
                toast.success(response.message);
                response && navigate(routes.admin_manageGenre);
            } else {
                const { data: response } = await axiosInstance.put(updateGenreUrl(id), data);
                toast.success(response.message);
                setUpdate((prev) => !prev);
            }
        } else {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            if (id !== 'new-genre') {
                const { data: res } = await axiosInstance.get(getGenreByIdUrl(id));
                setData({
                    name: res.data.name,
                    description: res.data.description,
                    image: res.data.image,
                });
            }
        };

        fetchData().catch(console.error);
    }, [id, update]);

    return (
        <div className={cx('container')}>
            <Paper className={cx('form-container')}>
                <h1 className={cx('heading')}>{id === 'new-genre' ? t('Add new genre') : t('Edit genre')}</h1>
                <form onSubmit={handleSubmit}>
                    <div className={cx('input-container')}>
                        <TextField
                            name='name'
                            label={t('Genre Name')}
                            handleInputState={handleInputState}
                            handleErrorState={handleErrorState}
                            schema={schema.name}
                            error={errors.name}
                            value={data.name}
                            required={true}
                        />
                    </div>
                    <div className={cx('input-container')}>
                        <TextField
                            name='description'
                            label={t('Description')}
                            handleInputState={handleInputState}
                            handleErrorState={handleErrorState}
                            schema={schema.description}
                            error={errors.description}
                            value={data.description}
                            required={true}
                        />
                    </div>
                    <div className={cx('input-container')}>
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
                        {id === 'new-genre' ? t('Add Genre') : t('Update Genre')}
                    </Button>
                </form>
            </Paper>
        </div>
    );
};

export default GenreForm;
