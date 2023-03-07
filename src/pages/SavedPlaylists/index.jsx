import React, { useState } from 'react';
import classNames from 'classnames/bind';
import { Grid } from '@mui/material';

import styles from './styles.scoped.scss';
import PlaylistItem from '~/components/PlaylistItem';
import { useEffect } from 'react';
import { getSavedPlaylistsUrl } from '~/api/urls/me';
import axiosInstance from '~/api/axiosInstance';
import { useTranslation } from 'react-i18next';

const cx = classNames.bind(styles);

const SavedPlaylists = () => {
    const [savedPlaylists, setSavedPlaylists] = useState();

    const { t } = useTranslation();

    useEffect(() => {
        const fetchSavedPlaylists = async () => {
            const { data } = await axiosInstance.get(getSavedPlaylistsUrl);
            setSavedPlaylists(data.data);
            // console.log(data.data);
        };

        fetchSavedPlaylists().catch(console.error);
    }, []);

    return (
        <div className={cx('container')}>
            <section className={cx('section-container')}>
                <h1 className={cx('heading')}>{t('Playlists')}</h1>
                <div className={cx('section-content')}>
                    <Grid container spacing={2}>
                        {savedPlaylists?.length !== 0 &&
                            savedPlaylists?.map((item, index) => (
                                <Grid item xl={2} lg={3} md={4} xs={6} key={index}>
                                    <PlaylistItem playlist={item?.playlist} to={`/playlist/${item?.playlist?._id}`} />
                                </Grid>
                            ))}
                    </Grid>
                </div>
            </section>
        </div>
    );
};

export default SavedPlaylists;
