import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
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
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';

import styles from './styles.scoped.scss';
import { useAuth } from '~/hooks';
import { playTrack, pauseTrack } from '~/api/audioPlayer';
import axiosInstance from '~/api/axiosInstance';
import { getLikedTracksUrl } from '~/api/urls/me';
import { updateTrack } from '~/redux/audioPlayerSlice';
import Like from '~/components/Like';
import { timeAgoFormat, fancyTimeFormat } from '~/utils/Format';
import TrackMenu from '~/components/TrackMenu';
import { useTranslation } from 'react-i18next';

const cx = classNames.bind(styles);

const LikedTracks = () => {
    const [likedTracks, setLikedTracks] = useState(null);
    const { context, isPlaying } = useSelector((state) => state.audioPlayer);
    const { likeTrackState } = useSelector((state) => state.updateState);

    const { userId, name } = useAuth();
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
        playTrack(dispatch, { context_uri: likedTracks[0]?.context_uri, position: likedTracks[0]?.position }).catch(
            console.error,
        );

        dispatch(updateTrack());
    };

    const handlePlayTrack = async (payload) => {
        playTrack(dispatch, payload).catch(console.error);
    };

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await axiosInstance.get(getLikedTracksUrl);
            setLikedTracks(data.data);
            // console.log(data.data);
        };

        fetchData().catch(console.error);
    }, [likeTrackState]);

    return (
        <div className={cx('container')}>
            <div className={cx('header')}>
                <div className={cx('image')}>
                    <FavoriteIcon sx={{ width: '80px', height: '80px' }} />
                </div>
                <div className={cx('info')}>
                    <h2 className={cx('type')}>{t('PLAYLIST')}</h2>
                    <span className={cx('name')}>{t('Liked Tracks')}</span>
                    {/* <div className='description'>
                        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aliquam quis eos ipsam dicta veritatis
                        rem porro odit eligendi molestiae pariatur, blanditiis numquam adipisci voluptatibus velit quos
                        quo quod sed voluptas!
                    </div> */}
                    <div className={cx('detail')}>
                        <Link to={`/user/${userId}`} className={cx('owner-name')}>
                            {name}
                        </Link>
                        <span className={cx('total-tracks')}>
                            {likedTracks?.length} {t('tracks')}
                        </span>
                        <span className={cx('total-time')}>
                            {t('Total time')}:{' '}
                            {fancyTimeFormat(likedTracks?.reduce((sum, item) => sum + item.track.duration, 0))}
                        </span>
                    </div>
                </div>
            </div>
            <div className={cx('actions')}>
                {likedTracks?.length !== 0 && (
                    <>
                        {context.contextType === 'liked' ? (
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
                    </>
                )}
            </div>
            <div className={cx('content')}>
                {likedTracks?.length !== 0 ? (
                    <TableContainer component={Paper} className={cx('table-container')} sx={{ overflowX: 'inherit' }}>
                        <Table sx={{ minWidth: 650 }} stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell align='center'>#</TableCell>
                                    <TableCell align='left'>{t('Track')}</TableCell>
                                    <TableCell align='left'>{t('Album')}</TableCell>
                                    <TableCell align='left'>{t('Added Date')}</TableCell>
                                    <TableCell align='left' />
                                    <TableCell align='left'>
                                        <AccessTimeIcon sx={{ width: '20px', height: '20px' }} />
                                    </TableCell>
                                    <TableCell align='left' />
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {likedTracks !== null ? (
                                    <>
                                        {likedTracks?.map((item, index) => (
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
                                                                    to={`/track/${item?.track?._id}/album/${
                                                                        item?.album?._id
                                                                    }`}
                                                                    className={cx('name-link', {
                                                                        active:
                                                                            context.context_uri === item?.context_uri,
                                                                    })}
                                                                >
                                                                    {item?.track.name}
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
                                                    <div className={cx('added-date')}>
                                                        {timeAgoFormat(item?.addedAt)}
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
                                                            inPage='liked-tracks'
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
                    <div className={cx('notification')}>{t('Do not have item yet')}</div>
                )}
            </div>
        </div>
    );
};

export default LikedTracks;
