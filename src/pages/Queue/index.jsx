import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
    Paper,
    Avatar,
    TableCell,
    TableRow,
    CircularProgress,
    TableContainer,
    Table,
    // TableHead,
    TableBody,
    IconButton,
    Button,
} from '@mui/material';
// import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

import TrackMenu from '~/components/TrackMenu';
import { playTrack, pauseTrack } from '~/api/audioPlayer';
import { fancyTimeFormat } from '~/utils/Format';
import Like from '~/components/Like';
import styles from './styles.scoped.scss';
import axiosInstance from '~/api/axiosInstance';
import { getQueueUrl, removeItemsFromQueueUrl } from '~/api/urls/me';
import { toast } from 'react-toastify';
import { updateQueueState } from '~/redux/updateStateSlice';
import { useTranslation } from 'react-i18next';

const cx = classNames.bind(styles);

const Queue = () => {
    const [currentTrack, setCurrentTrack] = useState(null);
    const [tracksInQueue, setTracksInQueue] = useState([]);
    const [nextTracks, setNextTracks] = useState([]);

    const { context, isPlaying } = useSelector((state) => state.audioPlayer);
    const { queueState } = useSelector((state) => state.updateState);
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

    const clearQueue = async () => {
        try {
            const { data } = await axiosInstance.delete(removeItemsFromQueueUrl, {
                data: {
                    items: tracksInQueue.map((item) => ({
                        context_uri: item.context_uri,
                        position: item.position,
                        order: item.order,
                    })),
                },
            });
            toast.success(data.message);
            dispatch(updateQueueState());
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await axiosInstance.get(getQueueUrl);
            setCurrentTrack(data.data.currentTrack);
            setTracksInQueue(data.data.tracksInQueue);
            setNextTracks(data.data.nextTracks);

            // console.log(data.data);
        };

        fetchData().catch(console.error);
    }, [queueState]);

    return (
        <div className={cx('container')}>
            <div className={cx('heading')}>{t('Queue')}</div>
            <section className={cx('section-container')}>
                <div className={cx('content')}>
                    <TableContainer component={Paper} className={cx('table-container')} sx={{ overflowX: 'inherit' }}>
                        <Table sx={{ minWidth: 650 }} stickyHeader>
                            <TableBody>
                                {currentTrack !== null ? (
                                    <>
                                        <TableRow>
                                            <TableCell align='left' colSpan={6}>
                                                <span
                                                    style={{
                                                        fontSize: '1.5rem',
                                                        fontWeight: '600',
                                                        color: 'var(--text-secondary)',
                                                    }}
                                                >
                                                    {t('Now playing')}
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow
                                            className={cx('track-container', {
                                                active: context.context_uri === currentTrack?.context_uri,
                                            })}
                                            onDoubleClick={() =>
                                                handlePlayTrack({
                                                    context_uri: currentTrack?.context_uri,
                                                    position: currentTrack?.position,
                                                })
                                            }
                                        >
                                            <TableCell align='left'>
                                                <div className={cx('order')}>
                                                    {context.context_uri === currentTrack?.context_uri ? (
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
                                                                        context_uri: currentTrack?.context_uri,
                                                                        position: currentTrack?.position,
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
                                                            <span className={cx('order-number')}>1</span>
                                                        </>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell align='left' sx={{ minWidth: '250px', padding: '10px' }}>
                                                <div className={cx('info')}>
                                                    <div className={cx('left')}>
                                                        <Avatar src={currentTrack?.track?.image} variant='square' />
                                                    </div>
                                                    <div className={cx('right')}>
                                                        <div className={cx('name')}>
                                                            <Link
                                                                to={`/track/${currentTrack?.track?._id}/album/${
                                                                    currentTrack?.album?._id
                                                                }`}
                                                                className={cx('name-link', {
                                                                    active:
                                                                        context.context_uri ===
                                                                        currentTrack?.context_uri,
                                                                })}
                                                            >
                                                                {currentTrack?.track?.name}
                                                            </Link>
                                                        </div>
                                                        <div className={cx('artists')}>
                                                            {currentTrack?.track?.artists.map((artist, index) => {
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
                                                        to={`/album/${currentTrack?.album._id}`}
                                                    >
                                                        {currentTrack?.album.name}
                                                    </Link>
                                                </div>
                                            </TableCell>
                                            <TableCell align='left'>
                                                <Like
                                                    type='track'
                                                    trackId={currentTrack?.track._id}
                                                    albumId={currentTrack?.album._id}
                                                />
                                            </TableCell>
                                            <TableCell align='left'>
                                                <div className={cx('duration')}>
                                                    {fancyTimeFormat(currentTrack?.track.duration)}
                                                </div>
                                            </TableCell>
                                            <TableCell align='left' sx={{ padding: 0 }}>
                                                <div className={cx('track-menu')}>
                                                    <TrackMenu
                                                        trackId={currentTrack?.track._id}
                                                        albumId={currentTrack?.album._id}
                                                        artists={currentTrack?.track.artists}
                                                        context_uri={currentTrack?.context_uri}
                                                        position={currentTrack?.position}
                                                        inPage='album'
                                                        albumOwnerId={currentTrack?.album?.owner?._id}
                                                    />
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    </>
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} align='center'>
                                            <CircularProgress
                                                sx={{ width: '100px', height: '100px' }}
                                                color='primary'
                                            />
                                        </TableCell>
                                    </TableRow>
                                )}
                                {tracksInQueue.length !== 0 && (
                                    <>
                                        <TableRow>
                                            <TableCell colSpan={2} align='left' sx={{ fontSize: '2.2rem' }}>
                                                <span
                                                    style={{
                                                        fontSize: '1.5rem',
                                                        fontWeight: '600',
                                                        color: 'var(--text-secondary)',
                                                    }}
                                                >
                                                    {t('Next in queue')}
                                                </span>
                                            </TableCell>
                                            <TableCell colSpan={4} align='right' sx={{ padding: 0 }}>
                                                <Button
                                                    variant='contained'
                                                    color='error'
                                                    sx={{ fontSize: '1rem', marginRight: '8px' }}
                                                    onClick={clearQueue}
                                                >
                                                    {t('Clear queue')}
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                        {tracksInQueue.map((item, index) => (
                                            <TableRow
                                                key={index}
                                                className={cx('track-container', {
                                                    // active: context.context_uri === item?.context_uri,
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
                                                            <span className={cx('order-number')}>{index + 2}</span>
                                                        </>
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
                                                                        item?.album?._id
                                                                    }`}
                                                                    className={cx('name-link', {
                                                                        // active:
                                                                        //     context.context_uri === item?.context_uri,
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
                                                            inPage='queue'
                                                            order={item?.order}
                                                        />
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </>
                                )}

                                {nextTracks.length !== 0 && (
                                    <>
                                        <TableRow>
                                            <TableCell colSpan={6} align='left'>
                                                <span
                                                    style={{
                                                        fontSize: '1.5rem',
                                                        fontWeight: '600',
                                                        color: 'var(--text-secondary)',
                                                    }}
                                                >
                                                    {t('Next up')}
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                        {nextTracks.map((item, index) => (
                                            <TableRow
                                                key={index}
                                                className={cx('track-container', {
                                                    // active: context.context_uri === item?.context_uri,
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
                                                                {index + 2 + tracksInQueue.length}
                                                            </span>
                                                        </>
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
                                                                        item?.album?._id
                                                                    }`}
                                                                    className={cx('name-link', {
                                                                        // active:
                                                                        //     context.context_uri === item?.context_uri,
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
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </section>
        </div>
    );
};

export default Queue;
