import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import { IconButton, Avatar, Grid } from '@mui/material';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';

// import AlbumItem from '~/components/AlbumItem';
import UserItem from '~/components/UserItem';
import styles from './styles.scoped.scss';
import { playTrack, pauseTrack } from '~/api/audioPlayer';
import axiosInstance from '~/api/axiosInstance';
import Like from '~/components/Like';
import { fancyTimeFormat } from '~/utils/Format';
import unknownPlaylistImg from '~/assets/images/playlist_unknown.jpg';
import { getEpisodeByIdUrl } from '~/api/urls/tracksUrls';
import { useTranslation } from 'react-i18next';
import PodcastItem from '~/components/PodcastItem';

const cx = classNames.bind(styles);

const Episode = () => {
    const [track, setTrack] = useState(null);
    const { context, isPlaying } = useSelector((state) => state.audioPlayer);

    const { id, podcastId } = useParams();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    console.log(podcastId);

    const handleTogglePlay = async () => {
        if (isPlaying) {
            pauseTrack(dispatch).catch(console.error);
        } else {
            playTrack(dispatch).catch(console.error);
        }
    };

    const handlePlayTrack = async (payload) => {
        playTrack(dispatch, { context_uri: `podcast:${podcastId}:${id}:${podcastId}:podcast` }).catch(console.error);
    };

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await axiosInstance.get(getEpisodeByIdUrl(id), { params: { detail: true } });
            setTrack(data.data);
            console.log(data.data);
        };

        fetchData().catch(console.error);
    }, [id, podcastId]);

    return (
        <div className={cx('container')}>
            <div className={cx('header')}>
                <div className={cx('image')}>
                    <Avatar
                        className={cx('image')}
                        variant='square'
                        src={track?.image.trim() === '' ? unknownPlaylistImg : track?.image}
                        alt={track?.name}
                        sx={{ width: '240px', height: '240px' }}
                    />
                </div>
                <div className={cx('info')}>
                    <h2 className={cx('type')}>{t('EPISODE')}</h2>
                    <span className={cx('name')}>{track?.name}</span>
                    {/* <div className='description'>{album?.description}</div> */}
                    <div className={cx('detail')}>
                        {/* <Link to={`/artist/${album?.owner?._id}`} className={cx('owner-name')}>
                            {album?.owner?.name}
                        </Link> */}
                        {track?.artists?.map((artist, index) => (
                            <span key={index} className={cx('artist')}>
                                <Link to={`/podcaster/${artist?.id}`} className={cx('owner-name')}>
                                    {artist?.name}
                                </Link>
                            </span>
                        ))}
                        <span className={cx('total-saved')}>
                            {track?.saved} {t('likes')}
                        </span>
                        <span className={cx('total-time')}>{fancyTimeFormat(track?.duration)}</span>
                    </div>
                </div>
            </div>
            <div className={cx('actions')}>
                <div className={cx('action')}>
                    {context.trackId === id ? (
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
                        <IconButton className={cx('play-btn')} disableRipple onClick={handlePlayTrack}>
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

                <div className={cx('action')}>
                    <Like type='episode' size='large' trackId={id} podcastId={podcastId} />
                </div>
                {/* <div className={cx('action')}>
                    <AlbumMenu tracks={album?.tracks} albumOwnerId={album?.owner?._id} albumId={album?._id} />
                </div> */}
            </div>

            <div className={cx('content')}>
                {track?.lyrics?.length !== 0 && (
                    <div className={cx('lyrics')}>
                        <h3 className={cx('heading')}>{t('Lyrics')}</h3>
                        {track?.lyrics[0]?.content?.split('\n').map((item, index) => (
                            <h5 className={cx('sentence')} key={index}>
                                {item}
                            </h5>
                        ))}
                    </div>
                )}
                <div className={cx('artist-container')}>
                    <h3 className={cx('heading')}>{t('Podcasters')}</h3>
                    <Grid container spacing={2}>
                        {track?.artists?.map((item, index) => (
                            <Grid item xs={12} key={index}>
                                <UserItem
                                    name={item.name}
                                    image={item.image}
                                    type={item.type}
                                    to={`/${item.type}/${item.id}`}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </div>
            </div>

            {track?.artists.length !== 0 && (
                <>
                    {track?.artists?.map((artist, index) => (
                        <section className={cx('section-container')} key={index}>
                            <h1 className={cx('heading')}>
                                {t('More podcasts of')} {artist?.name}
                            </h1>
                            <div className={cx('section-content')}>
                                <Grid container spacing={2}>
                                    {artist?.popularPodcasts?.length !== 0 &&
                                        artist?.popularPodcasts?.map((item, index) => (
                                            <Grid item xl={2} lg={3} md={4} xs={6} key={index}>
                                                <PodcastItem podcast={item} to={`/podcast/${item._id}`} />
                                            </Grid>
                                        ))}
                                </Grid>
                            </div>
                        </section>
                    ))}
                </>
            )}
        </div>
    );
};

export default Episode;
