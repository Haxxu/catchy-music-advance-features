import React, { useState, useEffect } from 'react';
import Joi from 'joi';
import classNames from 'classnames/bind';
import { useParams } from 'react-router-dom';
import { Paper, Button } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

import FileInput from '~/components/Inputs/FileInput';
import TextField from '~/components/Inputs/TextField';
import axiosInstance from '~/api/axiosInstance';
import { getPlaylistByIdUrl, updatePlaylistUrl } from '~/api/urls/playlistsUrl';
import styles from './styles.scoped.scss';
import TextArea from '~/components/Inputs/TextArea';
import { updatePlaylistState, updatePlaylistInSidebarState } from '~/redux/updateStateSlice';
import { useDispatch } from 'react-redux';

const cx = classNames.bind(styles);

const PlaylistForm = ({ customStyles, handleClose }) => {
    const [update, setUpdate] = useState(false);
    const [data, setData] = useState({
        name: '',
        description: '',
        image: null,
    });
    const [errors, setErrors] = useState({
        name: '',
        description: '',
        image: null,
    });
    const { t } = useTranslation();
    const { id } = useParams();
    const dispatch = useDispatch();

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
            const { data: response } = await axiosInstance.put(updatePlaylistUrl(id), data);
            toast.success(response.message);
            setUpdate((prev) => !prev);
            dispatch(updatePlaylistState());
            dispatch(updatePlaylistInSidebarState());
            handleClose();
        } else {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const { data: res } = await axiosInstance.get(getPlaylistByIdUrl(id));
            setData({
                name: res.data.name,
                description: res.data.description,
                image: res.data.image,
            });
        };

        fetchData().catch(console.error);
    }, [id, update]);

    return (
        <div className={cx('container')}>
            <Paper className={cx('form-container')}>
                <h1 className={cx('heading')}>{t('Edit Playlist')}</h1>
                <form onSubmit={handleSubmit}>
                    <div className={cx('input-container')}>
                        <TextField
                            name='name'
                            label={t('Playlist Name')}
                            handleInputState={handleInputState}
                            handleErrorState={handleErrorState}
                            schema={schema.name}
                            error={errors.name}
                            value={data.name}
                            required={true}
                            customStyles={customStyles.inputStyles}
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
                            customStyles={customStyles.textAreaStyles}
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
                            customStyles={customStyles.fileInputStyles}
                        />
                    </div>
                    <Button
                        variant='contained'
                        color='secondary'
                        size='large'
                        type='submit'
                        sx={{ marginTop: '2rem', fontSize: '1.4rem', fontWeight: 700 }}
                    >
                        {t('Update playlist')}
                    </Button>
                </form>
            </Paper>
        </div>
    );
};

export default PlaylistForm;
