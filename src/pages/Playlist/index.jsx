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
} from '@mui/material';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';

import styles from './styles.scoped.scss';
import { useAuth } from '~/hooks';
import { playTrack, pauseTrack } from '~/api/audioPlayer';
import axiosInstance from '~/api/axiosInstance';
import { updateTrack } from '~/redux/audioPlayerSlice';
import Like from '~/components/Like';
import { timeAgoFormat, fancyTimeFormat } from '~/utils/Format';
import TrackMenu from '~/components/TrackMenu';
import { getPlaylistByIdUrl } from '~/api/urls/playlistsUrl';
import unknownPlaylistImg from '~/assets/images/playlist_unknown.jpg';
import PlaylistMenu from '~/components/PlaylistMenu';
import { useTranslation } from 'react-i18next';

const cx = classNames.bind(styles);

const Playlist = () => {
    const [playlist, setPlaylist] = useState(null);
    const { context, isPlaying } = useSelector((state) => state.audioPlayer);
    const { playlistState } = useSelector((state) => state.updateState);
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
        playTrack(dispatch, {
            context_uri: playlist?.tracks[0]?.context_uri,
            position: playlist?.tracks[0]?.position,
        }).catch(console.error);
        dispatch(updateTrack());
    };

    const handlePlayTrack = async (payload) => {
        playTrack(dispatch, payload).catch(console.error);
    };

    useEffect(() => {
        // setPlaylist(null);
        const fetchData = async () => {
            const { data } = await axiosInstance.get(getPlaylistByIdUrl(id));
            setPlaylist(data.data);
            // console.log(data.data);
        };

        fetchData().catch(console.error);
    }, [playlistState, id]);

    return (
        <div className={cx('container')}>
            <div className={cx('header')}>
                <div className={cx('image')}>
                    <Avatar
                        className={cx('image')}
                        variant='square'
                        src={playlist?.image.trim() === '' ? unknownPlaylistImg : playlist?.image}
                        alt={playlist?.name}
                        sx={{ width: '240px', height: '240px' }}
                    />
                </div>
                <div className={cx('info')}>
                    <h2 className={cx('type')}>{t('PLAYLIST')}</h2>
                    <span className={cx('name')}>{playlist?.name}</span>
                    <div className='description'>{playlist?.description}</div>
                    <div className={cx('detail')}>
                        <Link to={`/${playlist?.owner?.type}/${playlist?.owner?._id}`} className={cx('owner-name')}>
                            {playlist?.owner?.name}
                        </Link>
                        <span className={cx('total-saved')}>
                            {playlist?.saved} {t('likes')}
                        </span>
                        <span className={cx('total-tracks')}>
                            {playlist?.tracks?.length} {t('tracks')}.{' '}
                        </span>
                        <span className={cx('total-time')}>
                            {t('Total time')}:{' '}
                            {fancyTimeFormat(playlist?.tracks?.reduce((sum, item) => sum + item.track.duration, 0))}
                        </span>
                    </div>
                </div>
            </div>
            <div className={cx('actions')}>
                {playlist?.tracks?.length !== 0 && (
                    <div className={cx('action')}>
                        {context.contextType === 'playlist' && context.contextId === id ? (
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

                {playlist && playlist?.owner?._id !== userId && (
                    <div className={cx('action')}>
                        <Like type='playlist' size='large' playlistId={playlist?._id} />
                    </div>
                )}
                <div className={cx('action')}>
                    <PlaylistMenu
                        playlistId={playlist?._id}
                        playlistOwnerId={playlist?.owner?._id}
                        tracks={playlist?.tracks}
                        isPublic={playlist?.isPublic}
                    />
                </div>
            </div>
            <div className={cx('content')}>
                {playlist?.tracks?.length !== 0 ? (
                    <TableContainer component={Paper} className={cx('table-container')} sx={{ overflowX: 'inherit' }}>
                        <Table sx={{ minWidth: 650 }} stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell align='center'>#</TableCell>
                                    <TableCell align='left'>{t('Track')}</TableCell>
                                    <TableCell align='left'>{t('Album or podcast')}</TableCell>
                                    <TableCell align='left'>{t('Added Date')}</TableCell>
                                    <TableCell align='left' />
                                    <TableCell align='left'>
                                        <AccessTimeIcon sx={{ width: '20px', height: '20px' }} />
                                    </TableCell>
                                    <TableCell align='left' />
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {playlist !== null ? (
                                    <>
                                        {playlist?.tracks?.map((item, index) => (
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
                                                                {item.trackType === 'episode' ? (
                                                                    <Link
                                                                        to={`/episode/${item?.track?._id}/podcast/${
                                                                            item?.podcast?._id
                                                                        }/`}
                                                                        className={cx('name-link', {
                                                                            active:
                                                                                context.context_uri ===
                                                                                item.context_uri,
                                                                        })}
                                                                    >
                                                                        {item?.track.name}
                                                                    </Link>
                                                                ) : (
                                                                    <Link
                                                                        to={`/track/${item?.track?._id}/album/${
                                                                            item?.album?._id
                                                                        }/`}
                                                                        className={cx('name-link', {
                                                                            active:
                                                                                context.context_uri ===
                                                                                item.context_uri,
                                                                        })}
                                                                    >
                                                                        {item?.track.name}
                                                                    </Link>
                                                                )}
                                                            </div>
                                                            <div className={cx('artists')}>
                                                                {item?.track?.artists.map((artist, index) => {
                                                                    return (
                                                                        <span key={index}>
                                                                            {index !== 0 ? ', ' : ''}
                                                                            {item.trackType === 'episode' ? (
                                                                                <Link to={`/podcaster/${artist.id}`}>
                                                                                    {artist.name}
                                                                                </Link>
                                                                            ) : (
                                                                                <Link to={`/artist/${artist.id}`}>
                                                                                    {artist.name}
                                                                                </Link>
                                                                            )}
                                                                        </span>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell align='left'>
                                                    <div className={cx('album-name')}>
                                                        {item.trackType === 'episode' ? (
                                                            <Link
                                                                className={cx('album-name-link')}
                                                                to={`/podcast/${item?.podcast._id}`}
                                                            >
                                                                {item?.podcast.name}
                                                            </Link>
                                                        ) : (
                                                            <Link
                                                                className={cx('album-name-link')}
                                                                to={`/album/${item?.album._id}`}
                                                            >
                                                                {item?.album.name}
                                                            </Link>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell align='left'>
                                                    <div className={cx('added-date')}>
                                                        {timeAgoFormat(item?.addedAt)}
                                                    </div>
                                                </TableCell>
                                                <TableCell align='left'>
                                                    {item.trackType === 'episode' ? (
                                                        <Like
                                                            type='episode'
                                                            trackId={item?.track._id}
                                                            podcastId={item?.podcast._id}
                                                        />
                                                    ) : (
                                                        <Like
                                                            type='track'
                                                            trackId={item?.track._id}
                                                            albumId={item?.album._id}
                                                        />
                                                    )}
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
                                                            albumId={item?.album?._id}
                                                            podcastId={item?.podcast?._id}
                                                            playlistId={playlist?._id}
                                                            artists={item?.track.artists}
                                                            context_uri={item?.context_uri}
                                                            position={item?.position}
                                                            inPage='playlist'
                                                            trackType={item.trackType}
                                                            playlistOwnerId={playlist?.owner?._id}
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
        </div>
    );
};

export default Playlist;
