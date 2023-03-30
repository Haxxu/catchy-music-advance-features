import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import { Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';

import styles from './styles.scoped.scss';
// import AlbumItem from '~/components/AlbumItem';
import { getSavedPodcastsUrl } from '~/api/urls/me';
import axiosInstance from '~/api/axiosInstance';
import PodcastItem from '~/components/PodcastItem';

const cx = classNames.bind(styles);

const SavedPodcasts = () => {
    const [savedPodcasts, setSavedPodcasts] = useState();
    const { t } = useTranslation();

    useEffect(() => {
        const fetchSavedPodcasts = async () => {
            const { data } = await axiosInstance.get(getSavedPodcastsUrl);
            setSavedPodcasts(data.data);
            console.log(data.data);
        };

        fetchSavedPodcasts().catch(console.error);
    }, []);

    return (
        <div className={cx('container')}>
            <section className={cx('section-container')}>
                <h1 className={cx('heading')}>{t('Podcasts')}</h1>
                <div className={cx('section-content')}>
                    <Grid container spacing={2}>
                        {savedPodcasts?.length !== 0 &&
                            savedPodcasts?.map((item, index) => (
                                <Grid item xl={2} lg={3} md={4} xs={6} key={index}>
                                    <PodcastItem podcast={item.podcast} to={`/podcast/${item.podcast._id}`} />
                                </Grid>
                            ))}
                    </Grid>
                </div>
            </section>
        </div>
    );
};

export default SavedPodcasts;
