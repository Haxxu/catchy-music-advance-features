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
import TextArea from '~/components/Inputs/TextArea';
import axiosInstance from '~/api/axiosInstance';
import { routes } from '~/config';
import styles from './styles.scoped.scss';
import { createPostUrl, getPostByIdUrl, updatePostByIdUrl } from '~/api/urls/postUrl';

const cx = classNames.bind(styles);

const PostForm = () => {
    const [update, setUpdate] = useState(false);
    const [data, setData] = useState({
        title: '',
        description: '',
        image: null,
    });
    const [errors, setErrors] = useState({ name: '', description: '' });

    const { id } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const schema = {
        title: Joi.string()
            .min(1)
            .required()
            .label('Title'),
        description: Joi.string()
            .allow('')
            .label('Description'),
        image: Joi.string().allow(''),
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
            if (id === 'new-post') {
                const { data: response } = await axiosInstance.post(createPostUrl(), data);
                toast.success(response.message);
                response && navigate(routes.managePosts);
            } else {
                const { data: response } = await axiosInstance.patch(updatePostByIdUrl(id), data);
                toast.success(response.message);
                setUpdate((prev) => !prev);
            }
        } else {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            if (id !== 'new-post') {
                const { data: res } = await axiosInstance.get(getPostByIdUrl(id));
                setData({
                    title: res.data.title,
                    image: res.data.image,
                    description: res.data.description,
                });
            }

            // console.log(data);
        };

        fetchData().catch(console.error);
    }, [id, update]);

    return (
        <div className={cx('container')}>
            <Paper className={cx('form-container')}>
                <h1 className={cx('heading')}>{id === 'new-post' ? t('Add new post') : t('Edit post')}</h1>
                <form onSubmit={handleSubmit}>
                    <div className={cx('input-container')}>
                        <TextField
                            name='title'
                            label={t('Title')}
                            handleInputState={handleInputState}
                            handleErrorState={handleErrorState}
                            schema={schema.title}
                            error={errors.title}
                            value={data.title}
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
                    <Button
                        variant='contained'
                        color='secondary'
                        size='large'
                        type='submit'
                        sx={{ marginTop: '2rem', fontSize: '1.4rem', fontWeight: 700 }}
                    >
                        {id === 'new-post' ? t('Add Post') : t('Update Post')}
                    </Button>
                </form>
            </Paper>
        </div>
    );
};

export default PostForm;
