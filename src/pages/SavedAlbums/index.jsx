import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import { Grid } from '@mui/material';

import styles from './styles.scoped.scss';
import AlbumItem from '~/components/AlbumItem';
import { getSavedAlbumsUrl } from '~/api/urls/me';
import axiosInstance from '~/api/axiosInstance';
import { useTranslation } from 'react-i18next';

const cx = classNames.bind(styles);

const SavedAlbums = () => {
    const [savedAlbums, setSavedAlbums] = useState();
    const { t } = useTranslation();

    useEffect(() => {
        const fetchSavedAlbums = async () => {
            const { data } = await axiosInstance.get(getSavedAlbumsUrl);
            setSavedAlbums(data.data);
            // console.log(data.data);
        };

        fetchSavedAlbums().catch(console.error);
    }, []);

    return (
        <div className={cx('container')}>
            <section className={cx('section-container')}>
                <h1 className={cx('heading')}>{t('Albums')}</h1>
                <div className={cx('section-content')}>
                    <Grid container spacing={2}>
                        {savedAlbums?.length !== 0 &&
                            savedAlbums?.map((item, index) => (
                                <Grid item xl={2} lg={3} md={4} xs={6} key={index}>
                                    <AlbumItem album={item.album} to={`/album/${item.album._id}`} />
                                </Grid>
                            ))}
                    </Grid>
                </div>
            </section>
        </div>
    );
};

export default SavedAlbums;
