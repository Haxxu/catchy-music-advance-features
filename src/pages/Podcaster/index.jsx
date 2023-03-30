import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import {
    Paper,
    Avatar,
    Grid,
    TableCell,
    TableRow,
    CircularProgress,
    TableContainer,
    Table,
    TableHead,
    TableBody,
    IconButton,
} from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

import TrackMenu from '~/components/TrackMenu';
import { useAuth } from '~/hooks';
import axiosInstance from '~/api/axiosInstance';
import styles from './styles.scoped.scss';
import { getUserByIdUrl } from '~/api/urls/usersUrl';
import FollowButton from '~/components/FollowButton';
import PlaylistItem from '~/components/PlaylistItem';
import UserItem from '~/components/UserItem';
import UserMenu from '~/components/UserMenu';
import { playTrack, pauseTrack } from '~/api/audioPlayer';
import { fancyTimeFormat } from '~/utils/Format';
import Like from '~/components/Like';
import { useTranslation } from 'react-i18next';
import PodcastItem from '~/components/PodcastItem';

const cx = classNames.bind(styles);

const Podcaster = () => {
    const [user, setUser] = useState(null);
    const { id } = useParams();
    const { userId } = useAuth();
    const dispatch = useDispatch();
    const { userPageState } = useSelector((state) => state.updateState);
    const { context, isPlaying } = useSelector((state) => state.audioPlayer);
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
            const { data } = await axiosInstance.get(getUserByIdUrl(id), { params: { detail: true } });
            setUser(data.data);
            // console.log(data.data);
        };

        fetchData().catch(console.error);
    }, [id, userPageState]);

    return (
        <div className={cx('container')}>
            <div className={cx('header')}>
                <div className={cx('image-container')}>
                    <Avatar
                        className={cx('image')}
                        variant='circular'
                        src={user?.image}
                        alt={user?.name}
                        sx={{ width: '240px', height: '240px' }}
                        component={Paper}
                        elevation={4}
                    />
                </div>
                <div className={cx('info')}>
                    <h2 className={cx('type')}>
                        <VerifiedIcon sx={{ width: '25px', height: '25px', marginRight: '10px' }} color='primary' />
                        {t('Verified Podcaster')}
                    </h2>
                    <span className={cx('name')}>{user?.name}</span>
                    {/* <div className='description'>{album?.description}</div> */}
                    <div className={cx('detail')}>
                        <span className={cx('total-publicPlaylist')}>
                            {user?.publicPlaylists?.length} {t('Public Playlists')}
                        </span>
                        <span className={cx('total')}>
                            {user?.followers?.length} {t('Followers')}
                        </span>
                        <span className={cx('total')}>
                            {user?.followings?.length} {t('Following')}
                        </span>
                    </div>
                </div>
            </div>
            <div className={cx('actions')}>
                {user?._id !== userId && (
                    <div className={cx('action')}>
                        <FollowButton userId={id} />
                    </div>
                )}
                {user?._id === userId && (
                    <div className={cx('action')}>
                        <UserMenu />
                    </div>
                )}
            </div>

            <section className={cx('section-container')}>
                <h1 className={cx('heading')}>{t('Popular Episodes')}</h1>
                <div className={cx('content')}>
                    {user?.popularEpisodes?.length !== 0 ? (
                        <TableContainer
                            component={Paper}
                            className={cx('table-container')}
                            sx={{ overflowX: 'inherit' }}
                        >
                            <Table sx={{ minWidth: 650 }} stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell align='center'>#</TableCell>
                                        <TableCell align='left'>{t('Track')}</TableCell>
                                        <TableCell align='left'>{t('Album')}</TableCell>
                                        <TableCell align='left'>{t('Plays')}</TableCell>
                                        <TableCell align='left' />
                                        <TableCell align='left'>
                                            <AccessTimeIcon sx={{ width: '20px', height: '20px' }} />
                                        </TableCell>
                                        <TableCell align='left' />
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {user?.popularEpisodes !== null ? (
                                        <>
                                            {user?.popularEpisodes.map((item, index) => (
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
                                                                        to={`/episode/${item?.track?._id}/podcast/${
                                                                            item?.podcast?._id
                                                                        }/`}
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
                                                        <div className={cx('album-name')}>
                                                            <Link
                                                                className={cx('album-name-link')}
                                                                to={`/podcast/${item?.podcast._id}`}
                                                            >
                                                                {item?.podcast.name}
                                                            </Link>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell align='left'>
                                                        <div className={cx('added-date')}>{item?.track?.plays}</div>
                                                    </TableCell>
                                                    <TableCell align='left'>
                                                        <Like
                                                            type='episode'
                                                            trackId={item?.track._id}
                                                            podcastId={item?.podcast._id}
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
                                                                podcastId={item?.podcast._id}
                                                                artists={item?.track.artists}
                                                                context_uri={item?.context_uri}
                                                                position={item?.position}
                                                                inPage='podcast'
                                                                podcastOwnerId={item?.podcast?.owner?._id}
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
            </section>

            {user?.releasedPodcasts?.length !== 0 && (
                <section className={cx('section-container')}>
                    <h1 className={cx('heading')}>{t('New Release Podcasts')}</h1>
                    <div className={cx('section-content')}>
                        <Grid container spacing={2}>
                            {user?.releasedPodcasts?.map((item, index) => (
                                <Grid item xl={2} lg={3} md={4} xs={6} key={index}>
                                    <PodcastItem podcast={item} to={`/podcast/${item._id}`} />
                                </Grid>
                            ))}
                        </Grid>
                    </div>
                </section>
            )}

            {user?.publicPlaylists?.length !== 0 && (
                <section className={cx('section-container')}>
                    <h1 className={cx('heading')}>{t('Public Playlists')}</h1>
                    <div className={cx('section-content')}>
                        <Grid container spacing={2}>
                            {user?.publicPlaylists?.map((item, index) => (
                                <Grid item xl={2} lg={3} md={4} xs={6} key={index}>
                                    <PlaylistItem playlist={item} to={`/playlist/${item._id}`} />
                                </Grid>
                            ))}
                        </Grid>
                    </div>
                </section>
            )}

            {user?.followers?.length !== 0 && (
                <section className={cx('section-container')}>
                    <h1 className={cx('heading')}>{t('Followers')}</h1>
                    <div className={cx('section-content')}>
                        <Grid container spacing={2}>
                            {user?.followers?.map((item, index) => (
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

            {user?.followings?.length !== 0 && (
                <section className={cx('section-container')}>
                    <h1 className={cx('heading')}>{t('Following')}</h1>
                    <div className={cx('section-content')}>
                        <Grid container spacing={2}>
                            {user?.followings?.map((item, index) => (
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

export default Podcaster;
