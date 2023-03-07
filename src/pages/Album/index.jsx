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

import AlbumItem from '~/components/AlbumItem';
import styles from './styles.scoped.scss';
import { useAuth } from '~/hooks';
import { playTrack, pauseTrack } from '~/api/audioPlayer';
import axiosInstance from '~/api/axiosInstance';
import { updateTrack } from '~/redux/audioPlayerSlice';
import Like from '~/components/Like';
import { timeAgoFormat, fancyTimeFormat } from '~/utils/Format';
import TrackMenu from '~/components/TrackMenu';
import unknownPlaylistImg from '~/assets/images/playlist_unknown.jpg';
import { getAlbumByIdUrl } from '~/api/urls/albumsUrl';
import { getArtistAlbumsUrl } from '~/api/urls/artistsUrl';
import AlbumMenu from '~/components/AlbumMenu';
import { useTranslation } from 'react-i18next';

const cx = classNames.bind(styles);

const Album = () => {
    const [album, setAlbum] = useState(null);
    const [moreAlbums, setMoreAlbums] = useState([]);
    const { context, isPlaying } = useSelector((state) => state.audioPlayer);
    const { albumState } = useSelector((state) => state.updateState);
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
            context_uri: album?.tracks[0]?.context_uri,
            position: album?.tracks[0]?.position,
        }).catch(console.error);
        dispatch(updateTrack());
    };

    const handlePlayTrack = async (payload) => {
        playTrack(dispatch, payload).catch(console.error);
    };

    useEffect(() => {
        const fetchAlbum = async () => {
            const { data } = await axiosInstance.get(getAlbumByIdUrl(id));
            setAlbum(data.data);
            // console.log(data.data);
            return data.data?.owner?._id;
        };

        const fetchMoreAlbums = async (id) => {
            const { data } = await axiosInstance.get(getArtistAlbumsUrl(id));
            setMoreAlbums(data.data);
            // console.log(data.data);
        };

        fetchAlbum()
            .catch(console.error)
            .then((id) => fetchMoreAlbums(id));
    }, [id, albumState]);

    return (
        <div className={cx('container')}>
            <div className={cx('header')}>
                <div className={cx('image')}>
                    <Avatar
                        className={cx('image')}
                        variant='square'
                        src={album?.image.trim() === '' ? unknownPlaylistImg : album?.image}
                        alt={album?.name}
                        sx={{ width: '240px', height: '240px' }}
                    />
                </div>
                <div className={cx('info')}>
                    <h2 className={cx('type')}>{album?.type === 'single' ? t('SINGLE') : t('ALBUM')}</h2>
                    <span className={cx('name')}>{album?.name}</span>
                    {/* <div className='description'>{album?.description}</div> */}
                    <div className={cx('detail')}>
                        <Link to={`/artist/${album?.owner?._id}`} className={cx('owner-name')}>
                            {album?.owner?.name}
                        </Link>
                        <span className={cx('year')}>{album?.year}</span>
                        <span className={cx('total-saved')}>
                            {album?.saved} {t('likes')}
                        </span>
                        <span className={cx('total-tracks')}>
                            {album?.tracks?.length} {t('tracks')}.{' '}
                        </span>
                        <span className={cx('total-time')}>
                            {t('Total time')}:{' '}
                            {fancyTimeFormat(album?.tracks?.reduce((sum, item) => sum + item.track.duration, 0))}
                        </span>
                    </div>
                </div>
            </div>
            <div className={cx('actions')}>
                {album?.tracks?.length !== 0 && (
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

                {album && album?.owner?._id !== userId && (
                    <div className={cx('action')}>
                        <Like type='album' size='large' albumId={album?._id} />
                    </div>
                )}
                <div className={cx('action')}>
                    <AlbumMenu tracks={album?.tracks} albumOwnerId={album?.owner?._id} albumId={album?._id} />
                </div>
            </div>
            <div className={cx('content')}>
                {album?.tracks?.length !== 0 ? (
                    <TableContainer component={Paper} className={cx('table-container')} sx={{ overflowX: 'inherit' }}>
                        <Table sx={{ minWidth: 650 }} stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell align='center'>#</TableCell>
                                    <TableCell align='left'>{t('Track')}</TableCell>
                                    <TableCell align='left'>{t('Added Date')}</TableCell>
                                    <TableCell align='left' />
                                    <TableCell align='left'>
                                        <AccessTimeIcon sx={{ width: '20px', height: '20px' }} />
                                    </TableCell>
                                    <TableCell align='left' />
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {album !== null ? (
                                    <>
                                        {album?.tracks?.map((item, index) => (
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
                                                                    to={`/track/${item?.track?._id}/album/${
                                                                        item?.track?._id
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
                                                    <div className={cx('added-date')}>
                                                        {timeAgoFormat(item?.addedAt)}
                                                    </div>
                                                </TableCell>
                                                <TableCell align='left'>
                                                    <Like type='track' trackId={item?.track._id} albumId={album?._id} />
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
                                                            albumId={album?._id}
                                                            artists={item?.track.artists}
                                                            context_uri={item?.context_uri}
                                                            position={item?.position}
                                                            inPage='album'
                                                            albumOwnerId={album?.owner?._id}
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
                <h1 className={cx('heading')}> {album?.owner?.name}</h1>
                <div className={cx('section-content')}>
                    <Grid container spacing={2}>
                        {moreAlbums?.length !== 0 &&
                            moreAlbums?.map((item, index) => (
                                <Grid item xl={2} lg={3} md={4} xs={6} key={index}>
                                    <AlbumItem album={item} to={`/album/${item._id}`} />
                                </Grid>
                            ))}
                    </Grid>
                </div>
            </section>
        </div>
    );
};

export default Album;
