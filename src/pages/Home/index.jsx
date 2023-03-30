import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';

import styles from './styles.scoped.scss';
import { Grid } from '@mui/material';

import PlaylistItem from '~/components/PlaylistItem';
import AlbumItem from '~/components/AlbumItem';
import PodcastItem from '~/components/PodcastItem';
import axiosInstance from '~/api/axiosInstance';
import { getPlaylistsByTagsUrl } from '~/api/urls/playlistsUrl';
import { getSavedPlaylistsUrl } from '~/api/urls/me';
import { getAlbumsByTagsUrl } from '~/api/urls/albumsUrl';
import { getPodcastsByTagsUrl } from '~/api/urls/podcastsUrl';
import { useTranslation } from 'react-i18next';
const cx = classNames.bind(styles);

const Home = () => {
    const [popularPlaylists, setPopularPlaylists] = useState([]);
    const [recommendPlaylists, setRecommendPlaylists] = useState([]);
    const [randomPlaylists, setRandomPlaylists] = useState([]);
    const [savedPlaylists, setSavedPlaylists] = useState([]);
    const [popularAlbums, setPopularAlbums] = useState([]);
    const [newReleaseAlbums, setNewReleaseAlbums] = useState([]);
    const [randomAlbums, setRandomAlbums] = useState([]);
    const [popularPodcasts, setPopularPodcasts] = useState([]);
    const [newReleasePodcasts, setNewReleasePodcasts] = useState([]);
    const [randomPodcasts, setRandomPodcasts] = useState([]);

    const { t } = useTranslation();

    const hiToUser = () => {
        var today = new Date();
        var curHr = today.getHours();

        if (curHr < 12) {
            return t('Good Morning');
        } else if (curHr < 18) {
            return t('Good Afternoon');
        } else {
            return t('Good Evening');
        }
    };

    useEffect(() => {
        const fetchDataPlaylists = async () => {
            const { data: playlistsResponse } = await axiosInstance.get(getPlaylistsByTagsUrl, {
                params: {
                    tags: ['popular', 'recommend', 'random'],
                },
            });
            setPopularPlaylists(playlistsResponse.data.popularPlaylists);
            setRecommendPlaylists(playlistsResponse.data.recommendPlaylists);
            setRandomPlaylists(playlistsResponse.data.randomPlaylists);
            // console.log(playlistsResponse.data.randomPlaylists);
        };

        const fetchDataAlbums = async () => {
            const { data: albumsResponse } = await axiosInstance.get(getAlbumsByTagsUrl, {
                params: {
                    tags: ['popular', 'new-release', 'random'],
                },
            });
            setPopularAlbums(albumsResponse.data.popularAlbums);
            setNewReleaseAlbums(albumsResponse.data.newReleaseAlbums);
            setRandomAlbums(albumsResponse.data.randomAlbums);
        };

        const fetchDataPodcasts = async () => {
            const { data: podcastsResponse } = await axiosInstance.get(getPodcastsByTagsUrl, {
                params: {
                    tags: ['popular', 'new-release', 'random'],
                },
            });
            setPopularPodcasts(podcastsResponse.data.popularPodcasts);
            setNewReleasePodcasts(podcastsResponse.data.newReleasePodcasts);
            setRandomPodcasts(podcastsResponse.data.randomPodcasts);

            console.log(podcastsResponse.data);
        };

        const fetchDataSavedPlaylists = async () => {
            const { data: savedPlaylistsRes } = await axiosInstance(getSavedPlaylistsUrl);
            setSavedPlaylists(savedPlaylistsRes.data);
            // console.log(savedPlaylistsRes.data);
        };

        fetchDataPlaylists().catch(console.error);
        fetchDataAlbums().catch(console.error);
        fetchDataSavedPlaylists().catch(console.error);
        fetchDataPodcasts().catch(console.error);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className={cx('container')}>
            <section className={cx('section-container')}>
                <h1 className={cx('heading')}>{hiToUser()}</h1>
                <div className={cx('section-content')}>
                    <Grid container spacing={2}>
                        {popularPlaylists?.length !== 0 && (
                            <Grid item xl={4} md={6} xs={12}>
                                <PlaylistItem
                                    type='reduce'
                                    playlist={popularPlaylists[0]}
                                    to={`/playlist/${popularPlaylists[0]?._id}`}
                                />
                            </Grid>
                        )}
                        {recommendPlaylists?.length !== 0 && (
                            <Grid item xl={4} md={6} xs={12}>
                                <PlaylistItem
                                    type='reduce'
                                    playlist={recommendPlaylists[0]}
                                    to={`/playlist/${recommendPlaylists[0]?._id}`}
                                />
                            </Grid>
                        )}
                        {recommendPlaylists?.length > 1 && (
                            <Grid item xl={4} md={6} xs={12}>
                                <PlaylistItem
                                    type='reduce'
                                    playlist={recommendPlaylists[1]}
                                    to={`/playlist/${recommendPlaylists[1]?._id}`}
                                />
                            </Grid>
                        )}
                        {randomPlaylists?.length !== 0 && (
                            <Grid item xl={4} md={6} xs={12}>
                                <PlaylistItem
                                    type='reduce'
                                    playlist={randomPlaylists[0]}
                                    to={`/playlist/${randomPlaylists[0]?._id}`}
                                />
                            </Grid>
                        )}
                        {savedPlaylists?.length !== 0 && (
                            <Grid item xl={4} md={6} xs={12}>
                                <PlaylistItem
                                    type='reduce'
                                    playlist={savedPlaylists[0].playlist}
                                    to={`/playlist/${savedPlaylists[0]?.playlist?._id}`}
                                />
                            </Grid>
                        )}
                    </Grid>
                </div>
            </section>

            <section className={cx('section-container')}>
                <h1 className={cx('heading')}>{t('New Release Albums')}</h1>
                <div className={cx('section-content')}>
                    <Grid container spacing={2}>
                        {newReleaseAlbums?.length !== 0 &&
                            newReleaseAlbums?.map((item, index) => (
                                <Grid item xl={2} lg={3} md={4} xs={6} key={index}>
                                    <AlbumItem album={item} to={`/album/${item._id}`} />
                                </Grid>
                            ))}
                    </Grid>
                </div>
            </section>

            <section className={cx('section-container')}>
                <h1 className={cx('heading')}>{t('New Release Podcasts')}</h1>
                <div className={cx('section-content')}>
                    <Grid container spacing={2}>
                        {newReleasePodcasts?.length !== 0 &&
                            newReleasePodcasts?.map((item, index) => (
                                <Grid item xl={2} lg={3} md={4} xs={6} key={index}>
                                    <PodcastItem podcast={item} to={`/podcast/${item._id}`} />
                                </Grid>
                            ))}
                    </Grid>
                </div>
            </section>

            <section className={cx('section-container')}>
                <h1 className={cx('heading')}>{t('Popular Playlists')}</h1>
                <div className={cx('section-content')}>
                    <Grid container spacing={2}>
                        {popularPlaylists?.length !== 0 &&
                            popularPlaylists?.map((item, index) => (
                                <Grid item xl={2} lg={3} md={4} xs={6} key={index}>
                                    <PlaylistItem playlist={item} to={`/playlist/${item._id}`} />
                                </Grid>
                            ))}
                    </Grid>
                </div>
            </section>

            <section className={cx('section-container')}>
                <h1 className={cx('heading')}>{t('Recommend Playlists')}</h1>
                <div className={cx('section-content')}>
                    <Grid container spacing={2}>
                        {recommendPlaylists?.length !== 0 &&
                            recommendPlaylists?.map((item, index) => (
                                <Grid item xl={2} lg={3} md={4} xs={6} key={index}>
                                    <PlaylistItem playlist={item} to={`/playlist/${item._id}`} />
                                </Grid>
                            ))}
                    </Grid>
                </div>
            </section>

            <section className={cx('section-container')}>
                <h1 className={cx('heading')}>{t('Discover New Playlists')}</h1>
                <div className={cx('section-content')}>
                    <Grid container spacing={2}>
                        {randomPlaylists?.length !== 0 &&
                            randomPlaylists?.map((item, index) => (
                                <Grid item xl={2} lg={3} md={4} xs={6} key={index}>
                                    <PlaylistItem playlist={item} to={`/playlist/${item._id}`} />
                                </Grid>
                            ))}
                    </Grid>
                </div>
            </section>

            <section className={cx('section-container')}>
                <h1 className={cx('heading')}>{t('Discover New Albums')}</h1>
                <div className={cx('section-content')}>
                    <Grid container spacing={2}>
                        {randomAlbums?.length !== 0 &&
                            randomAlbums?.map((item, index) => (
                                <Grid item xl={2} lg={3} md={4} xs={6} key={index}>
                                    <AlbumItem album={item} to={`/album/${item._id}`} />
                                </Grid>
                            ))}
                    </Grid>
                </div>
            </section>

            <section className={cx('section-container')}>
                <h1 className={cx('heading')}>{t('Popular Albums')}</h1>
                <div className={cx('section-content')}>
                    <Grid container spacing={2}>
                        {popularAlbums?.length !== 0 &&
                            popularAlbums?.map((item, index) => (
                                <Grid item xl={2} lg={3} md={4} xs={6} key={index}>
                                    <AlbumItem album={item} to={`/album/${item._id}`} />
                                </Grid>
                            ))}
                    </Grid>
                </div>
            </section>

            <section className={cx('section-container')}>
                <h1 className={cx('heading')}>{t('Discover New Podcasts')}</h1>
                <div className={cx('section-content')}>
                    <Grid container spacing={2}>
                        {randomPodcasts?.length !== 0 &&
                            randomPodcasts?.map((item, index) => (
                                <Grid item xl={2} lg={3} md={4} xs={6} key={index}>
                                    <PodcastItem podcast={item} to={`/podcast/${item._id}`} />
                                </Grid>
                            ))}
                    </Grid>
                </div>
            </section>

            <section className={cx('section-container')}>
                <h1 className={cx('heading')}>{t('Popular Podcasts')}</h1>
                <div className={cx('section-content')}>
                    <Grid container spacing={2}>
                        {popularPodcasts?.length !== 0 &&
                            popularPodcasts?.map((item, index) => (
                                <Grid item xl={2} lg={3} md={4} xs={6} key={index}>
                                    <PodcastItem podcast={item} to={`/podcast/${item._id}`} />
                                </Grid>
                            ))}
                    </Grid>
                </div>
            </section>

            <section className={cx('section-container')}>
                <h1 className={cx('heading')}>{t('Saved Playlists')}</h1>
                <div className={cx('section-content')}>
                    <Grid container spacing={2}>
                        {savedPlaylists?.length !== 0 &&
                            savedPlaylists?.map((item, index) => (
                                <Grid item xl={2} lg={3} md={4} xs={6} key={index}>
                                    {/* Because saved playlists will return different type some we must add .playlist */}
                                    <PlaylistItem playlist={item?.playlist} to={`/playlist/${item.playlist._id}`} />
                                </Grid>
                            ))}
                    </Grid>
                </div>
            </section>
        </div>
    );
};

export default Home;
