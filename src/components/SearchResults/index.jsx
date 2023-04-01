import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
    Paper,
    Avatar,
    Grid,
    TableCell,
    TableRow,
    CircularProgress,
    TableContainer,
    Table,
    // TableHead,
    TableBody,
    IconButton,
} from '@mui/material';
// import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useTranslation } from 'react-i18next';

import styles from './styles.scoped.scss';
import { useDebounce } from '~/hooks';
import axiosInstance from '~/api/axiosInstance';
import { searchUrl } from '~/api/urls/searchUrl';
import { playTrack, pauseTrack } from '~/api/audioPlayer';
import { fancyTimeFormat } from '~/utils/Format';
import PlaylistItem from '~/components/PlaylistItem';
import AlbumItem from '~/components/AlbumItem';
import UserItem from '~/components/UserItem';
import TrackMenu from '~/components/TrackMenu';
import Like from '~/components/Like';
import EpisodeItem from '~/components/EpisodeItem';
import PodcastItem from '~/components/PodcastItem';

const cx = classNames.bind(styles);

const SearchResults = ({ searchInput }) => {
    const [tracks, setTracks] = useState([]);
    const [episodes, setEpisodes] = useState([]);
    const [playlists, setPlaylists] = useState([]);
    const [albums, setAlbums] = useState([]);
    const [users, setUsers] = useState([]);
    const [artists, setArtists] = useState([]);
    const [podcasters, setPodcasters] = useState([]);
    const [podcasts, setPodcasts] = useState([]);
    const debouncedValue = useDebounce(searchInput, 800);
    const { context, isPlaying } = useSelector((state) => state.audioPlayer);

    const dispatch = useDispatch();
    const { t } = useTranslation();

    const handlePlayTrack = async (payload) => {
        playTrack(dispatch, payload).catch(console.error);
    };

    const handleTogglePlay = async () => {
        if (isPlaying) {
            pauseTrack(dispatch).catch(console.error);
        } else {
            playTrack(dispatch).catch(console.error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            if (searchInput.trim() !== '') {
                const { data } = await axiosInstance.get(searchUrl, {
                    params: {
                        q: searchInput,
                        tags: ['track', 'episodes', 'album', 'playlist', 'artist', 'user', 'podcasters', 'podcasts'],
                        limit: 10,
                    },
                });
                setTracks(data.data?.tracks);
                setEpisodes(data.data?.episodes);
                setPlaylists(data.data?.playlists);
                setAlbums(data.data?.albums);
                setUsers(data.data?.users);
                setArtists(data.data?.artists);
                setPodcasters(data.data?.podcasters);
                setPodcasts(data.data?.podcasts);

                // console.log(data.data);
            }

            // console.log(data.data?.playlists);
        };

        fetchData().catch(console.error);

        if (searchInput.trim() === '') {
            setTracks([]);
            setEpisodes([]);
            setPlaylists([]);
            setAlbums([]);
            setUsers([]);
            setArtists([]);
        }
        // eslint-disable-next-line
    }, [debouncedValue]);

    return (
        <div className={cx('container')}>
            {searchInput.trim() !== '' && (
                <div className={cx('heading')}>
                    {t('Search results:')} {searchInput}
                </div>
            )}

            {tracks.length !== 0 && (
                <section className={cx('section-container')}>
                    <h1 className={cx('heading')}>{t('Top Tracks')}</h1>
                    <div className={cx('content')}>
                        <TableContainer
                            component={Paper}
                            className={cx('table-container')}
                            sx={{ overflowX: 'inherit' }}
                        >
                            <Table sx={{ minWidth: 650 }} stickyHeader>
                                {/* <TableHead>
                                    <TableRow>
                                        <TableCell align='center'>#</TableCell>
                                        <TableCell align='left'>Track</TableCell>
                                        <TableCell align='left'>Album</TableCell>
                                        <TableCell align='left'>Plays</TableCell>
                                        <TableCell align='left' />
                                        <TableCell align='left'>
                                            <AccessTimeIcon sx={{ width: '20px', height: '20px' }} />
                                        </TableCell>
                                        <TableCell align='left' />
                                    </TableRow>
                                </TableHead> */}
                                <TableBody>
                                    {tracks !== null ? (
                                        <>
                                            {tracks.map((item, index) => (
                                                <TableRow
                                                    key={index}
                                                    className={cx('track-container', {
                                                        active: context.context_uri === item?.context_uri,
                                                    })}
                                                    onDoubleClick={() =>
                                                        handlePlayTrack({
                                                            context_uri: item?.context_uri,
                                                            position: item?.position,
                                                        })
                                                    }
                                                >
                                                    <TableCell align='left'>
                                                        <div className={cx('order')}>
                                                            {context.context_uri === item?.context_uri ? (
                                                                <IconButton
                                                                    disableRipple
                                                                    onClick={handleTogglePlay}
                                                                    sx={{ padding: 0 }}
                                                                >
                                                                    {isPlaying ? (
                                                                        <PauseIcon
                                                                            className={cx('control')}
                                                                            sx={{
                                                                                width: '20px',
                                                                                height: '20px',
                                                                                color: 'var(--primary-color)',
                                                                            }}
                                                                        />
                                                                    ) : (
                                                                        <PlayArrowIcon
                                                                            className={cx('control')}
                                                                            sx={{
                                                                                width: '20px',
                                                                                height: '20px',
                                                                                color: 'var(--primary-color)',
                                                                            }}
                                                                        />
                                                                    )}
                                                                </IconButton>
                                                            ) : (
                                                                <>
                                                                    <IconButton
                                                                        disableRipple
                                                                        onClick={() =>
                                                                            handlePlayTrack({
                                                                                context_uri: item?.context_uri,
                                                                                position: item?.position,
                                                                            })
                                                                        }
                                                                        className={cx('play-btn')}
                                                                        sx={{ padding: 0 }}
                                                                    >
                                                                        <PlayArrowIcon
                                                                            className={cx('control')}
                                                                            sx={{
                                                                                width: '20px',
                                                                                height: '20px',
                                                                                color: 'var(--primary-color)',
                                                                            }}
                                                                        />
                                                                    </IconButton>
                                                                    <span className={cx('order-number')}>
                                                                        {index + 1}
                                                                    </span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell align='left' sx={{ minWidth: '250px', padding: '10px' }}>
                                                        <div className={cx('info')}>
                                                            <div className={cx('left')}>
                                                                <Avatar src={item?.track?.image} variant='square' />
                                                            </div>
                                                            <div className={cx('right')}>
                                                                <div className={cx('name')}>
                                                                    <Link
                                                                        to={`/track/${item?.track?._id}/album/${
                                                                            item?.album._id
                                                                        }`}
                                                                        className={cx('name-link', {
                                                                            active:
                                                                                context.context_uri ===
                                                                                item?.context_uri,
                                                                        })}
                                                                    >
                                                                        {item?.track?.name}
                                                                    </Link>
                                                                </div>
                                                                <div className={cx('artists')}>
                                                                    {item?.track?.artists.map((artist, index) => {
                                                                        return (
                                                                            <span key={index}>
                                                                                {index !== 0 ? ', ' : ''}
                                                                                <Link to={`/artist/${artist.id}`}>
                                                                                    {artist.name}
                                                                                </Link>
                                                                            </span>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell align='left'>
                                                        <div className={cx('album-name')}>
                                                            <Link
                                                                className={cx('album-name-link')}
                                                                to={`/album/${item?.album._id}`}
                                                            >
                                                                {item?.album.name}
                                                            </Link>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell align='left'>
                                                        <div className={cx('added-date')}>{item?.track?.plays}</div>
                                                    </TableCell>
                                                    <TableCell align='left'>
                                                        <Like
                                                            type='track'
                                                            trackId={item?.track._id}
                                                            albumId={item?.album._id}
                                                        />
                                                    </TableCell>
                                                    <TableCell align='left'>
                                                        <div className={cx('duration')}>
                                                            {fancyTimeFormat(item?.track.duration)}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell align='left' sx={{ padding: 0 }}>
                                                        <div className={cx('track-menu')}>
                                                            <TrackMenu
                                                                trackId={item?.track._id}
                                                                albumId={item?.album._id}
                                                                artists={item?.track.artists}
                                                                context_uri={item?.context_uri}
                                                                position={item?.position}
                                                                inPage='album'
                                                                albumOwnerId={item?.album?.owner?._id}
                                                            />
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </>
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={8} align='center'>
                                                <CircularProgress
                                                    sx={{ width: '100px', height: '100px' }}
                                                    color='primary'
                                                />
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                </section>
            )}

            {artists.length !== 0 && (
                <section className={cx('section-container')}>
                    <h1 className={cx('heading')}>{t('Artists')}</h1>
                    <div className={cx('section-content')}>
                        <Grid container spacing={2}>
                            {artists?.map((item, index) => (
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

            {podcasters.length !== 0 && (
                <section className={cx('section-container')}>
                    <h1 className={cx('heading')}>{t('Podcasters')}</h1>
                    <div className={cx('section-content')}>
                        <Grid container spacing={2}>
                            {podcasters?.map((item, index) => (
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

            {albums.length !== 0 && (
                <section className={cx('section-container')}>
                    <h1 className={cx('heading')}>{t('Albums')}</h1>
                    <div className={cx('section-content')}>
                        <Grid container spacing={2}>
                            {albums?.length !== 0 &&
                                albums?.map((item, index) => (
                                    <Grid item xl={2} lg={3} md={4} xs={6} key={index}>
                                        <AlbumItem album={item} to={`/album/${item._id}`} />
                                    </Grid>
                                ))}
                        </Grid>
                    </div>
                </section>
            )}

            {playlists.length !== 0 && (
                <section className={cx('section-container')}>
                    <h1 className={cx('heading')}>{t('Playlists')}</h1>
                    <div className={cx('section-content')}>
                        <Grid container spacing={2}>
                            {playlists?.length !== 0 &&
                                playlists?.map((item, index) => (
                                    <Grid item xl={2} lg={3} md={4} xs={6} key={index}>
                                        <PlaylistItem playlist={item} to={`/playlist/${item?._id}`} />
                                    </Grid>
                                ))}
                        </Grid>
                    </div>
                </section>
            )}

            {podcasts.length !== 0 && (
                <section className={cx('section-container')}>
                    <h1 className={cx('heading')}>{t('Podcasts')}</h1>
                    <div className={cx('section-content')}>
                        <Grid container spacing={2}>
                            {podcasts?.length !== 0 &&
                                podcasts?.map((item, index) => (
                                    <Grid item xl={2} lg={3} md={4} xs={6} key={index}>
                                        <PodcastItem podcast={item} to={`/podcast/${item._id}`} />
                                    </Grid>
                                ))}
                        </Grid>
                    </div>
                </section>
            )}

            {episodes.length !== 0 && (
                <section className={cx('section-container')}>
                    <h1 className={cx('heading')}>{t('Episodes')}</h1>
                    <div className={cx('section-content')}>
                        <Grid container spacing={2}>
                            {episodes?.length !== 0 &&
                                episodes?.map((item, index) => (
                                    <Grid item xl={2} lg={3} md={4} xs={6} key={index}>
                                        <EpisodeItem
                                            podcast={item.podcast}
                                            episode={item.track}
                                            context_uri={item.context_uri}
                                            position={item.position}
                                            to={`/episode/${item?.track._id}/podcast/${item?.podcast._id}`}
                                        />
                                    </Grid>
                                ))}
                        </Grid>
                    </div>
                </section>
            )}

            {users.length !== 0 && (
                <section className={cx('section-container')}>
                    <h1 className={cx('heading')}>{t('Users Profile')}</h1>
                    <div className={cx('section-content')}>
                        <Grid container spacing={2}>
                            {users?.map((item, index) => (
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
        </div>
    );
};

export default SearchResults;
