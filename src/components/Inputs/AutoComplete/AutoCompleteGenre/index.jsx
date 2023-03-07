import React, { useState, useEffect } from 'react';
import { Autocomplete, Chip, TextField } from '@mui/material';
import classNames from 'classnames/bind';

import { getGenresUrl } from '~/api/urls/genresUrl';
import axiosInstance from '~/api/axiosInstance';
import styles from './styles.scoped.scss';
import { useTranslation } from 'react-i18next';

const cx = classNames.bind(styles);

const AutoCompleteGenre = ({ genres, handleInputState, label }) => {
    const [value, setValue] = useState([]);
    const [detailGenres, setDetailGenres] = useState([]);

    const { t } = useTranslation();

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await axiosInstance.get(getGenresUrl);
            setValue(data.data);
        };

        fetchData().catch(console.error);
    }, []);

    useEffect(() => {
        setDetailGenres(value.filter((item) => genres.indexOf(item._id) !== -1));
    }, [genres, value]);

    return (
        <div className={cx('container')}>
            <div className={cx('label')}>{label}</div>
            <Autocomplete
                multiple
                value={detailGenres}
                onChange={(event, newValue) => {
                    handleInputState('genres', [...newValue.map((option) => option._id)]);
                }}
                options={value}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) => option._id === value._id}
                renderTags={(tagValue, getTagProps) =>
                    tagValue.map((option, index) => (
                        <Chip label={option.name} {...getTagProps({ index })} sx={{ fontSize: '1.4rem' }} />
                    ))
                }
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant='outlined'
                        placeholder={t('Search genre')}
                        sx={{
                            '& input': {
                                fontSize: '1.5rem',
                            },
                            '& span': {
                                fontSize: '1.6rem',
                            },
                        }}
                    />
                )}
                size='medium'
                sx={{
                    fontSize: '2rem',
                }}
            />
        </div>
    );
};

export default AutoCompleteGenre;
