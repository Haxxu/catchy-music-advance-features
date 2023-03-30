import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import {
    Table,
    IconButton,
    TableContainer,
    Paper,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Avatar,
    CircularProgress,
    Grid,
} from '@mui/material';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { useTranslation } from 'react-i18next';

// import AlbumItem from '~/components/AlbumItem';
import styles from './styles.scoped.scss';
import { useAuth } from '~/hooks';
import { playTrack, pauseTrack } from '~/api/audioPlayer';
import axiosInstance from '~/api/axiosInstance';
import { updateTrack } from '~/redux/audioPlayerSlice';
import Like from '~/components/Like';
import { timeAgoFormat, fancyTimeFormat } from '~/utils/Format';
import TrackMenu from '~/components/TrackMenu';
import unknownPlaylistImg from '~/assets/images/playlist_unknown.jpg';
// import { getAlbumByIdUrl } from '~/api/urls/albumsUrl';
import { getPodcasterPodcastsUrl } from '~/api/urls/podcastersUrl';
import { getPodcastByIdUrl } from '~/api/urls/podcastsUrl';
// import { getArtistAlbumsUrl } from '~/api/urls/artistsUrl';
// import AlbumMenu from '~/components/AlbumMenu';
import PodcastMenu from '~/components/PodcastMenu';
import PodcastItem from '~/components/PodcastItem';

const cx = classNames.bind(styles);

const Podcast = () => {
    const [podcast, setPodcast] = useState(null);
    const [morePodcasts, setMorePodcasts] = useState([]);
    const { context, isPlaying } = useSelector((state) => state.audioPlayer);
    const { podcastState } = useSelector((state) => state.updateState);
    const { id } = useParams();
    const { userId } = useAuth();
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const handleTogglePlay = async () => {
        if (isPlaying) {
            pauseTrack(dispatch).catch(console.error);
        } else {
            playTrack(dispatch).catch(console.error);
        }
    };

    const playFirstTrack = async () => {
        console.log({
            context_uri: podcast?.episodes[0]?.context_uri,
            position: podcast?.episodes[0]?.position,
        });
        playTrack(dispatch, {
            context_uri: podcast?.episodes[0]?.context_uri,
            position: podcast?.episodes[0]?.position,
        }).catch(console.error);
        dispatch(updateTrack());
    };

    const handlePlayTrack = async (payload) => {
        playTrack(dispatch, payload).catch(console.error);
    };

    useEffect(() => {
        const fetchPodcast = async () => {
            const { data } = await axiosInstance.get(getPodcastByIdUrl(id));
            setPodcast(data.data);
            console.log(data.data);
            return data.data?.owner?._id;
        };

        const fetchMorePodcasts = async (id) => {
            const { data } = await axiosInstance.get(getPodcasterPodcastsUrl(id));
            setMorePodcasts(data.data);
            // console.log(data.data);
        };

        fetchPodcast()
            .catch(console.error)
            .then((id) => fetchMorePodcasts(id));
    }, [id, podcastState]);

    return (
        <div className={cx('container')}>
            <div className={cx('header')}>
                <div className={cx('image')}>
                    <Avatar
                        className={cx('image')}
                        variant='square'
                        src={podcast?.image.trim() === '' ? unknownPlaylistImg : podcast?.image}
                        alt={podcast?.name}
                        sx={{ width: '240px', height: '240px' }}
                    />
                </div>
                <div className={cx('info')}>
                    <h2 className={cx('type')}>{t('PODCAST')}</h2>
                    <span className={cx('name')}>{podcast?.name}</span>
                    {/* <div className='description'>{podcast?.description}</div> */}
                    <div className={cx('detail')}>
                        <Link to={`/podcaster/${podcast?.owner?._id}`} className={cx('owner-name')}>
                            {podcast?.owner?.name}
                        </Link>
                        <span className={cx('year')}>{podcast?.year}</span>
                        <span className={cx('total-saved')}>
                            {podcast?.saved} {t('likes')}
                        </span>
                        <span className={cx('total-tracks')}>
                            {podcast?.episodes?.length} {t('episodes')}.{' '}
                        </span>
                        <span className={cx('total-time')}>
                            {t('Total time')}:{' '}
                            {fancyTimeFormat(podcast?.episodes?.reduce((sum, item) => sum + item.track.duration, 0))}
                        </span>
                    </div>
                </div>
            </div>
            <div className={cx('actions')}>
                {podcast?.episodes?.length !== 0 && (
                    <div className={cx('action')}>
                        {context.contextType === 'podcast' && context.contextId === id ? (
                            <IconButton className={cx('play-btn')} disableRipple onClick={handleTogglePlay}>
                                {isPlaying ? (
                                    <PauseCircleIcon
                                        className={cx('control')}
                                        sx={{
                                            width: '65px',
                                            height: '65px',
                                        }}
                                    />
                                ) : (
                                    <PlayCircleIcon
                                        className={cx('control')}
                                        sx={{
                                            width: '65px',
                                            height: '65px',
                                        }}
                                    />
                                )}
                            </IconButton>
                        ) : (
                            <IconButton className={cx('play-btn')} disableRipple onClick={playFirstTrack}>
                                <PlayCircleIcon
                                    className={cx('control')}
                                    sx={{
                                        width: '65px',
                                        height: '65px',
                                    }}
                                />
                            </IconButton>
                        )}
                    </div>
                )}

                {podcast && podcast?.owner?._id !== userId && (
                    <div className={cx('action')}>
                        <Like type='podcast' size='large' podcastId={podcast?._id} />
                    </div>
                )}
                <div className={cx('action')}>
                    <PodcastMenu
                        episodes={podcast?.episodes}
                        podcastOwnerId={podcast?.owner?._id}
                        podcastId={podcast?._id}
                    />
                </div>
            </div>
            <div className={cx('content')}>
                {podcast?.episodes?.length !== 0 ? (
                    <TableContainer component={Paper} className={cx('table-container')} sx={{ overflowX: 'inherit' }}>
                        <Table sx={{ minWidth: 650 }} stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell align='center'>#</TableCell>
                                    <TableCell align='left'>{t('Episode')}</TableCell>
                                    <TableCell align='left'>{t('Added Date')}</TableCell>
                                    <TableCell align='left' />
                                    <TableCell align='left'>
                                        <AccessTimeIcon sx={{ width: '20px', height: '20px' }} />
                                    </TableCell>
                                    <TableCell align='left' />
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {podcast !== null ? (
                                    <>
                                        {podcast?.episodes?.map((item, index) => (
                                            <TableRow
                                                key={index}
                                                className={cx('track-container', {
                                                    active: context.context_uri === item.context_uri,
                                                })}
                                                onDoubleClick={() =>
                                                    handlePlayTrack({
                                                        context_uri: item.context_uri,
                                                        position: item.position,
                                                    })
                                                }
                                            >
                                                <TableCell align='left'>
                                                    <div className={cx('order')}>
                                                        {context.context_uri === item.context_uri ? (
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
                                                                            context_uri: item.context_uri,
                                                                            position: item.position,
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
                                                                <span className={cx('order-number')}>{index + 1}</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell align='left' sx={{ minWidth: '250px', padding: '10px' }}>
                                                    <div className={cx('info')}>
                                                        <div className={cx('left')}>
                                                            <Avatar src={item?.track.image} variant='square' />
                                                        </div>
                                                        <div className={cx('right')}>
                                                            <div className={cx('name')}>
                                                                <Link
                                                                    className={cx('name-link', {
                                                                        active:
                                                                            context.context_uri === item.context_uri,
                                                                    })}
                                                                    to={`/episode/${item?.track?._id}/podcast/${
                                                                        podcast._id
                                                                    }`}
                                                                >
                                                                    {item?.track.name}
                                                                </Link>
                                                            </div>
                                                            <div className={cx('artists')}>
                                                                {item?.track?.artists.map((artist, index) => {
                                                                    return (
                                                                        <span key={index}>
                                                                            {index !== 0 ? ', ' : ''}
                                                                            <Link to={`/podcaster/${artist.id}`}>
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
                                                    <div className={cx('added-date')}>
                                                        {timeAgoFormat(item?.addedAt)}
                                                    </div>
                                                </TableCell>
                                                <TableCell align='left'>
                                                    <Like
                                                        type='episode'
                                                        trackId={item?.track._id}
                                                        podcastId={podcast?._id}
                                                    />
                                                </TableCell>
                                                <TableCell align='left'>
                                                    <div className={cx('duration')}>
                                                        {fancyTimeFormat(item.track.duration)}
                                                    </div>
                                                </TableCell>
                                                <TableCell align='left' sx={{ padding: 0 }}>
                                                    <div className={cx('track-menu')}>
                                                        <TrackMenu
                                                            trackId={item?.track._id}
                                                            podcastId={podcast?._id}
                                                            artists={item?.track.artists}
                                                            context_uri={item?.context_uri}
                                                            position={item?.position}
                                                            inPage='podcast'
                                                            podcastOwnerId={podcast?.owner?._id}
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
                ) : (
                    <div className={cx('notification')}>{t('Do not have item yet')}.</div>
                )}
            </div>

            <section className={cx('section-container')}>
                <h1 className={cx('heading')}> {podcast?.owner?.name}</h1>
                <div className={cx('section-content')}>
                    <Grid container spacing={2}>
                        {morePodcasts?.length !== 0 &&
                            morePodcasts?.map((item, index) => (
                                <Grid item xl={2} lg={3} md={4} xs={6} key={index}>
                                    <PodcastItem podcast={item} to={`/podcast/${item._id}`} />
                                </Grid>
                            ))}
                    </Grid>
                </div>
            </section>
        </div>
    );
};

export default Podcast;
