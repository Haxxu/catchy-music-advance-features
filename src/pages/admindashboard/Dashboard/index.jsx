import React, { useEffect, useState } from 'react';
import { Grid, CircularProgress } from '@mui/material';
import classNames from 'classnames/bind';
import { useTranslation } from 'react-i18next';

import axiosInstance from '~/api/axiosInstance';
import { getUsersInfoUrl } from '~/api/urls/usersUrl';
import { getArtistsInfoUrl } from '~/api/urls/artistsUrl';
import { getPodcastersInfoUrl } from '~/api/urls/podcastersUrl';
import { getTracksInfoUrl } from '~/api/urls/tracksUrls';
import { getAlbumsInfoUrl } from '~/api/urls/albumsUrl';
import { getPodcastsInfoUrl } from '~/api/urls/podcastsUrl';
import { getPlaylistsInfoUrl } from '~/api/urls/playlistsUrl';
import { nFormatter } from '~/utils/Format';
import styles from './styles.scoped.scss';
import { getPostsInfoUrl } from '~/api/urls/postUrl';

const cx = classNames.bind(styles);

const Dashboard = () => {
    const [usersInfo, setUsersInfo] = useState(null);
    const [artistsInfo, setArtistsInfo] = useState(null);
    const [podcastersInfo, setPodcastersInfo] = useState(null);
    const [tracksInfo, setTracksInfo] = useState(null);
    const [episodesInfo, setEpisodesInfo] = useState(null);
    const [songsInfo, setSongsInfo] = useState(null);
    const [albumsInfo, setAlbumsInfo] = useState(null);
    const [playlistsInfo, setPlaylistsInfo] = useState(null);
    const [podcastsInfo, setPodcastsInfo] = useState(null);
    const [postsInfo, setPostsInfo] = useState(null);

    const { t } = useTranslation();

    useEffect(() => {
        const fetchDataUsers = async () => {
            const { data: users } = await axiosInstance(getUsersInfoUrl);
            setUsersInfo(users.data);
        };
        const fetchDataArtists = async () => {
            const { data: artists } = await axiosInstance(getArtistsInfoUrl);
            setArtistsInfo(artists.data);
        };
        const fetchDataTracks = async () => {
            const { data: tracks } = await axiosInstance(getTracksInfoUrl);
            setTracksInfo(tracks.data);
        };
        const fetchDataPodcasters = async () => {
            const { data: podcasters } = await axiosInstance(getPodcastersInfoUrl);
            setPodcastersInfo(podcasters.data);
        };
        const fetchDataEpisodes = async () => {
            const { data: episodes } = await axiosInstance(getTracksInfoUrl, { params: { type: 'episode' } });
            setEpisodesInfo(episodes.data);
        };
        const fetchDataSongs = async () => {
            const { data: songs } = await axiosInstance(getTracksInfoUrl, { params: { type: 'song' } });
            setSongsInfo(songs.data);
        };
        const fetchDataAlbums = async () => {
            const { data: albums } = await axiosInstance(getAlbumsInfoUrl);
            setAlbumsInfo(albums.data);
        };
        const fetchDataPodcasts = async () => {
            const { data: podcasts } = await axiosInstance(getPodcastsInfoUrl);
            setPodcastsInfo(podcasts.data);
        };
        const fetchDataPlaylists = async () => {
            const { data: playlists } = await axiosInstance(getPlaylistsInfoUrl);
            setPlaylistsInfo(playlists.data);
        };
        const fetchDataPosts = async () => {
            const res = await axiosInstance.get(getPostsInfoUrl());
            setPostsInfo(res.data.data);
        };

        fetchDataUsers().catch(console.error);
        fetchDataArtists().catch(console.error);
        fetchDataTracks().catch(console.error);
        fetchDataPodcasters().catch(console.error);
        fetchDataEpisodes().catch(console.error);
        fetchDataSongs().catch(console.error);
        fetchDataAlbums().catch(console.error);
        fetchDataPodcasts().catch(console.error);
        fetchDataPlaylists().catch(console.error);
        fetchDataPosts().catch(console.error);
    }, []);

    return (
        <div className={cx('container')}>
            <div className={cx('header')}>
                <h2>{t('Welcome back!')}</h2>
            </div>
            <Grid container spacing={1}>
                <Grid item xs={12} md={6} xl={4}>
                    {usersInfo ? (
                        <div className={cx('info')}>
                            <div className={cx('left')}>
                                <div className={cx('title')}>{t('Users')}</div>
                                <div className={cx('new-today')}>
                                    <span className={cx('number')}>{nFormatter(usersInfo.newUsersToday)}</span>
                                    <span className={cx('percentage')}>
                                        {parseFloat(usersInfo.newUsersToday / usersInfo.totalUsers).toPrecision(2)}%
                                    </span>
                                </div>
                                <div className={cx('bottom-title')}>{t('New Members today')}</div>
                            </div>
                            <div className={cx('right')}>
                                <div className={cx('detail-info')}>
                                    {t('Total Users')}:{' '}
                                    <span className={cx('number')}>{nFormatter(usersInfo.totalUsers)}</span>
                                </div>
                                <div className={cx('detail-info')}>
                                    {t('This month')}:{' '}
                                    <span className={cx('number')}>{nFormatter(usersInfo.newUsersThisMonth)}</span>
                                    <span className={cx('percentage')}>
                                        {parseFloat(usersInfo.newUsersThisMonth / usersInfo.totalUsers).toPrecision(2)}%
                                    </span>
                                </div>
                                <div className={cx('detail-info')}>
                                    {t('Last month')}:{' '}
                                    <span className={cx('number')}>{nFormatter(usersInfo.newUsersLastMonth)}</span>
                                    <span className={cx('percentage')}>
                                        {parseFloat(usersInfo.newUsersLastMonth / usersInfo.totalUsers).toPrecision(2)}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <CircularProgress color='primary' />
                    )}
                </Grid>
                <Grid item xs={12} md={6} xl={4}>
                    {artistsInfo ? (
                        <div className={cx('info')}>
                            <div className={cx('left')}>
                                <div className={cx('title')}>{t('Artist')}</div>
                                <div className={cx('new-today')}>
                                    <span className={cx('number')}>{nFormatter(artistsInfo.totalArtists)}</span>
                                </div>
                                <div className={cx('bottom-title')}>{t('Total Artists')}</div>
                            </div>
                        </div>
                    ) : (
                        <CircularProgress color='primary' />
                    )}
                </Grid>
                <Grid item xs={12} md={6} xl={4}>
                    {podcastersInfo ? (
                        <div className={cx('info')}>
                            <div className={cx('left')}>
                                <div className={cx('title')}>{t('Podcaster')}</div>
                                <div className={cx('new-today')}>
                                    <span className={cx('number')}>{nFormatter(podcastersInfo.totalPodcasters)}</span>
                                </div>
                                <div className={cx('bottom-title')}>{t('Total Podcasters')}</div>
                            </div>
                        </div>
                    ) : (
                        <CircularProgress color='primary' />
                    )}
                </Grid>
                <Grid item xs={12} md={6} xl={4}>
                    {tracksInfo ? (
                        <div className={cx('info')}>
                            <div className={cx('left')}>
                                <div className={cx('title')}>{t('Tracks')}</div>
                                <div className={cx('new-today')}>
                                    <span className={cx('number')}>{nFormatter(tracksInfo.newTracksToday)}</span>
                                </div>
                                <div className={cx('bottom-title')}>{t('New Tracks today')}</div>
                            </div>
                            <div className={cx('right')}>
                                <div className={cx('detail-info')}>
                                    {t('Total Tracks')}:{' '}
                                    <span className={cx('number')}>{nFormatter(tracksInfo.totalTracks)}</span>
                                </div>
                                <div className={cx('detail-info')}>
                                    {t('This month')}:{' '}
                                    <span className={cx('number')}>{nFormatter(tracksInfo.newTracksThisMonth)}</span>
                                </div>
                                <div className={cx('detail-info')}>
                                    {t('Last month')}:{' '}
                                    <span className={cx('number')}>{nFormatter(tracksInfo.newTracksLastMonth)}</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <CircularProgress color='primary' />
                    )}
                </Grid>
                <Grid item xs={12} md={6} xl={4}>
                    {songsInfo ? (
                        <div className={cx('info')}>
                            <div className={cx('left')}>
                                <div className={cx('title')}>{t('Songs')}</div>
                                <div className={cx('new-today')}>
                                    <span className={cx('number')}>{nFormatter(songsInfo.newTracksToday)}</span>
                                </div>
                                <div className={cx('bottom-title')}>{t('New Songs today')}</div>
                            </div>
                            <div className={cx('right')}>
                                <div className={cx('detail-info')}>
                                    {t('Total Songs')}:{' '}
                                    <span className={cx('number')}>{nFormatter(songsInfo.totalTracks)}</span>
                                </div>
                                <div className={cx('detail-info')}>
                                    {t('This month')}:{' '}
                                    <span className={cx('number')}>{nFormatter(songsInfo.newTracksThisMonth)}</span>
                                </div>
                                <div className={cx('detail-info')}>
                                    {t('Last month')}:{' '}
                                    <span className={cx('number')}>{nFormatter(songsInfo.newTracksLastMonth)}</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <CircularProgress color='primary' />
                    )}
                </Grid>
                <Grid item xs={12} md={6} xl={4}>
                    {episodesInfo ? (
                        <div className={cx('info')}>
                            <div className={cx('left')}>
                                <div className={cx('title')}>{t('Episodes')}</div>
                                <div className={cx('new-today')}>
                                    <span className={cx('number')}>{nFormatter(episodesInfo.newTracksToday)}</span>
                                </div>
                                <div className={cx('bottom-title')}>{t('New Episodes today')}</div>
                            </div>
                            <div className={cx('right')}>
                                <div className={cx('detail-info')}>
                                    {t('Total Episodes')}:{' '}
                                    <span className={cx('number')}>{nFormatter(episodesInfo.totalTracks)}</span>
                                </div>
                                <div className={cx('detail-info')}>
                                    {t('This month')}:{' '}
                                    <span className={cx('number')}>{nFormatter(episodesInfo.newTracksThisMonth)}</span>
                                </div>
                                <div className={cx('detail-info')}>
                                    {t('Last month')}:{' '}
                                    <span className={cx('number')}>{nFormatter(episodesInfo.newTracksLastMonth)}</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <CircularProgress color='primary' />
                    )}
                </Grid>
                <Grid item xs={12} md={6} xl={4}>
                    {albumsInfo ? (
                        <div className={cx('info')}>
                            <div className={cx('left')}>
                                <div className={cx('title')}>{t('Albums')}</div>
                                <div className={cx('new-today')}>
                                    <span className={cx('number')}>{nFormatter(albumsInfo.newAlbumsToday)}</span>
                                </div>
                                <div className={cx('bottom-title')}>{t('New Albums today')}</div>
                            </div>
                            <div className={cx('right')}>
                                <div className={cx('detail-info')}>
                                    {t('Total Albums')}:{' '}
                                    <span className={cx('number')}>{nFormatter(albumsInfo.totalAlbums)}</span>
                                </div>
                                <div className={cx('detail-info')}>
                                    {t('This month')}:{' '}
                                    <span className={cx('number')}>{nFormatter(albumsInfo.newAlbumsThisMonth)}</span>
                                </div>
                                <div className={cx('detail-info')}>
                                    {t('Last month')}:{' '}
                                    <span className={cx('number')}>{nFormatter(albumsInfo.newAlbumsLastMonth)}</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <CircularProgress color='primary' />
                    )}
                </Grid>
                <Grid item xs={12} md={6} xl={4}>
                    {podcastsInfo ? (
                        <div className={cx('info')}>
                            <div className={cx('left')}>
                                <div className={cx('title')}>{t('Podcasts')}</div>
                                <div className={cx('new-today')}>
                                    <span className={cx('number')}>{nFormatter(podcastsInfo.newPodcastsToday)}</span>
                                </div>
                                <div className={cx('bottom-title')}>{t('New Podcasts today')}</div>
                            </div>
                            <div className={cx('right')}>
                                <div className={cx('detail-info')}>
                                    {t('Total Podcasts')}:{' '}
                                    <span className={cx('number')}>{nFormatter(podcastsInfo.totalPodcasts)}</span>
                                </div>
                                <div className={cx('detail-info')}>
                                    {t('This month')}:{' '}
                                    <span className={cx('number')}>
                                        {nFormatter(podcastsInfo.newPodcastsThisMonth)}
                                    </span>
                                </div>
                                <div className={cx('detail-info')}>
                                    {t('Last month')}:{' '}
                                    <span className={cx('number')}>
                                        {nFormatter(podcastsInfo.newPodcastsLastMonth)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <CircularProgress color='primary' />
                    )}
                </Grid>
                <Grid item xs={12} md={6} xl={4}>
                    {playlistsInfo ? (
                        <div className={cx('info')}>
                            <div className={cx('left')}>
                                <div className={cx('title')}>{t('Playlists')}</div>
                                <div className={cx('new-today')}>
                                    <span className={cx('number')}>{nFormatter(playlistsInfo.newPlaylistsToday)}</span>
                                </div>
                                <div className={cx('bottom-title')}>{t('New Playlists today')}</div>
                            </div>
                            <div className={cx('right')}>
                                <div className={cx('detail-info')}>
                                    {t('Total Playlists')}:{' '}
                                    <span className={cx('number')}>{nFormatter(playlistsInfo.totalPlaylists)}</span>
                                </div>
                                <div className={cx('detail-info')}>
                                    {t('This month')}:{' '}
                                    <span className={cx('number')}>
                                        {nFormatter(playlistsInfo.newPlaylistsThisMonth)}
                                    </span>
                                </div>
                                <div className={cx('detail-info')}>
                                    {t('This month')}:{' '}
                                    <span className={cx('number')}>
                                        {nFormatter(playlistsInfo.newPlaylistsLastMonth)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <CircularProgress color='primary' />
                    )}
                </Grid>

                <Grid item xs={12} md={6} xl={4}>
                    {postsInfo ? (
                        <div className={cx('info')}>
                            <div className={cx('left')}>
                                <div className={cx('title')}>{t('Posts')}</div>
                                <div className={cx('new-today')}>
                                    <span className={cx('number')}>{nFormatter(postsInfo.newPostsToday)}</span>
                                </div>
                                <div className={cx('bottom-title')}>{t('New Posts today')}</div>
                            </div>
                            <div className={cx('right')}>
                                <div className={cx('detail-info')}>
                                    {t('Total Posts')}:{' '}
                                    <span className={cx('number')}>{nFormatter(postsInfo.totalPosts)}</span>
                                </div>
                                <div className={cx('detail-info')}>
                                    {t('This month')}:{' '}
                                    <span className={cx('number')}>{nFormatter(postsInfo.newPostsThisMonth)}</span>
                                </div>
                                <div className={cx('detail-info')}>
                                    {t('This month')}:{' '}
                                    <span className={cx('number')}>{nFormatter(postsInfo.newPostsLastMonth)}</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <CircularProgress color='primary' />
                    )}
                </Grid>
            </Grid>
        </div>
    );
};

export default Dashboard;
