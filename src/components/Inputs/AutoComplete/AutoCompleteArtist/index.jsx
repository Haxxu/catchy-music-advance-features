import React, { useState, useEffect } from 'react';
import { Autocomplete, Chip, TextField } from '@mui/material';
import classNames from 'classnames/bind';

import { getArtistsUrl } from '~/api/urls/artistsUrl';
import axiosInstance from '~/api/axiosInstance';
import styles from './styles.scoped.scss';
import { useTranslation } from 'react-i18next';

const cx = classNames.bind(styles);

const AutoCompleteArtist = ({ artists, handleInputState, defaultArtist, label }) => {
    const [value, setValue] = useState([]);

    const { t } = useTranslation();

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await axiosInstance.get(getArtistsUrl);
            setValue(data.data);
        };

        fetchData().catch(console.error);
    }, []);

    return (
        <div className={cx('container')}>
            <div className={cx('label')}>{label}</div>
            <Autocomplete
                multiple
                value={artists}
                onChange={(event, newValue) => {
                    handleInputState('artists', [
                        defaultArtist,
                        ...newValue.filter((option) => {
                            return option.id !== defaultArtist.id;
                        }),
                    ]);
                }}
                options={value}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderTags={(tagValue, getTagProps) =>
                    tagValue.map((option, index) => (
                        <Chip
                            label={option.name}
                            {...getTagProps({ index })}
                            disabled={option.id === defaultArtist.id}
                            sx={{ fontSize: '1.4rem' }}
                        />
                    ))
                }
                defaultValue={[defaultArtist]}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant='outlined'
                        placeholder={t('Search artist')}
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

export default AutoCompleteArtist;
