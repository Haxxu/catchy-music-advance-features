import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import { Grid } from '@mui/material';

import styles from './styles.scoped.scss';
import AlbumItem from '~/components/AlbumItem';
import UserItem from '~/components/UserItem';
import PlaylistItem from '~/components/PlaylistItem';
import axiosInstance from '~/api/axiosInstance';
import { getGenreByIdUrl } from '~/api/urls/genresUrl';
import { useTranslation } from 'react-i18next';

const cx = classNames.bind(styles);

const Genre = () => {
    const [genre, setGenre] = useState(null);
    const { id } = useParams();
    const { t } = useTranslation();

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await axiosInstance.get(getGenreByIdUrl(id), { params: { detail: true } });
            setGenre(data.data);
        };

        fetchData().catch(console.error);
    }, [id]);

    return (
        <div className={cx('container')}>
            <div className={cx('heading')}>{genre?.name}</div>

            {genre && genre?.newReleaseAlbums.length !== 0 && (
                <section className={cx('section-container')}>
                    <h1 className={cx('heading')}>{t('Albums')}</h1>
                    <div className={cx('section-content')}>
                        <Grid container spacing={2}>
                            {genre?.newReleaseAlbums?.length !== 0 &&
                                genre?.newReleaseAlbums?.map((item, index) => (
                                    <Grid item xl={2} lg={3} md={4} xs={6} key={index}>
                                        <AlbumItem album={item} to={`/album/${item._id}`} />
                                    </Grid>
                                ))}
                        </Grid>
                    </div>
                </section>
            )}

            {genre && genre?.artists.length !== 0 && (
                <section className={cx('section-container')}>
                    <h1 className={cx('heading')}>{t('Artists')}</h1>
                    <div className={cx('section-content')}>
                        <Grid container spacing={2}>
                            {genre?.artists?.map((item, index) => (
                                <Grid item xl={2} lg={3} md={4} xs={6} key={index}>
                                    <UserItem
                                        name={item.name}
                                        image={item.image}
                                        type={item.type}
                                        to={`/${item.type}/${item._id}`}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </div>
                </section>
            )}

            {genre && genre?.recommendPlaylists.length !== 0 && (
                <section className={cx('section-container')}>
                    <h1 className={cx('heading')}>{t('Recommend Playlists')}</h1>
                    <div className={cx('section-content')}>
                        <Grid container spacing={2}>
                            {genre?.recommendPlaylists?.length !== 0 &&
                                genre?.recommendPlaylists?.map((item, index) => (
                                    <Grid item xl={2} lg={3} md={4} xs={6} key={index}>
                                        <PlaylistItem playlist={item} to={`/playlist/${item?._id}`} />
                                    </Grid>
                                ))}
                        </Grid>
                    </div>
                </section>
            )}

            {genre && genre?.popularAlbums.length !== 0 && genre && (
                <section className={cx('section-container')}>
                    <h1 className={cx('heading')}>{t('Popular Albums')}</h1>
                    <div className={cx('section-content')}>
                        <Grid container spacing={2}>
                            {genre?.popularAlbums?.length !== 0 &&
                                genre?.popularAlbums?.map((item, index) => (
                                    <Grid item xl={2} lg={3} md={4} xs={6} key={index}>
                                        <AlbumItem album={item} to={`/album/${item._id}`} />
                                    </Grid>
                                ))}
                        </Grid>
                    </div>
                </section>
            )}

            {genre && genre?.popularPlaylists.length !== 0 && genre && (
                <section className={cx('section-container')}>
                    <h1 className={cx('heading')}>{t('Popular Playlists')}</h1>
                    <div className={cx('section-content')}>
                        <Grid container spacing={2}>
                            {genre?.popularPlaylists?.length !== 0 &&
                                genre?.popularPlaylists?.map((item, index) => (
                                    <Grid item xl={2} lg={3} md={4} xs={6} key={index}>
                                        <PlaylistItem playlist={item} to={`/playlist/${item?._id}`} />
                                    </Grid>
                                ))}
                        </Grid>
                    </div>
                </section>
            )}
        </div>
    );
};

export default Genre;
