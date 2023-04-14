import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames/bind';
import { Avatar, IconButton } from '@mui/material';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import RepeatIcon from '@mui/icons-material/Repeat';
import RepeatOneIcon from '@mui/icons-material/RepeatOne';
import MicExternalOnIcon from '@mui/icons-material/MicExternalOn';
import QueueMusicIcon from '@mui/icons-material/QueueMusic';
// import ReactAudioPlayer from 'react-audio-player';

import Like from '~/components/Like';
import TrackProgressBar from '~/components/TrackProgressBar';
import VolumeControl from '~/components/VolumeControl';
import { fancyTimeFormat } from '~/utils/Format';
import styles from './styles.module.scss';
import { routes } from '~/config';
import {
    getAudioPlayerState,
    getCurrentlyPlayingTrack,
    changeVolume,
    playTrack,
    pauseTrack,
    skipNext,
    skipPrevious,
    changeRepeatMode,
    changeShuffleMode,
    setListeningTrack,
    getCurrentPlayingTime,
} from '~/api/audioPlayer';
import SkipForwardCustomIcon from '~/components/Icon/SkipForwardCustom';
import SkipBackwardCustomIcon from '~/components/Icon/SkipBackwardCustom';

const cx = classNames.bind(styles);

const AudioPlayer = () => {
    const [percentage, setPercentage] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);

    const { currentTrack, volume, isPlaying, update, repeat, shuffle } = useSelector((state) => state.audioPlayer);

    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // console.log(currentTrack);

    const audioRef = useRef();

    const getCurrDuration = (e) => {
        const percent = ((e.currentTarget.currentTime / e.currentTarget.duration) * 100).toFixed(2);
        const time = e.currentTarget.currentTime;

        setPercentage(+percent);
        setCurrentTime(time.toFixed(2));
    };

    const onChangeAudio = (e) => {
        const audio = audioRef.current;
        audio.currentTime = (audio.duration / 100) * e.target.value;
        // setPercentage(e.target.value);

        if (currentTrack?.trackType === 'episode') {
            let payload = {
                track: currentTrack?.track,
                podcast: currentTrack?.detailPodcast._id,
                offset: parseInt(audio.currentTime),
            };
            setListeningTrack(dispatch, payload).catch(console.error);
        }
    };

    const onChangeVolume = (e) => {
        changeVolume(dispatch, Math.round(e.target.value)).catch(console.error);
    };

    const handleTogglePlay = async () => {
        if (currentTrack?.trackType === 'episode') {
            const payload = {
                track: currentTrack?.track,
                podcast: currentTrack?.detailPodcast._id,
                offset: parseInt(audioRef.current.currentTime),
            };
            if (isPlaying) {
                setListeningTrack(dispatch, payload);
                pauseTrack(dispatch).catch(console.error);
            } else {
                setListeningTrack(dispatch, payload);
                playTrack(dispatch).catch(console.error);
            }
        } else {
            if (isPlaying) {
                pauseTrack(dispatch).catch(console.error);
            } else {
                playTrack(dispatch).catch(console.error);
            }
        }
    };

    const handleToggleShuffle = async () => {
        // setShuffle((prev) => !prev);
        changeShuffleMode(dispatch, shuffle).catch(console.error);
    };

    const handleToggleRepeatMode = async () => {
        changeRepeatMode(dispatch, repeat).catch(console.error);
    };

    const handleSkipNext = async () => {
        skipNext(dispatch).catch(console.error);
        setPercentage(0);
        setDuration(0);
        setCurrentTime(0);
    };

    const handleSkipPrevious = async () => {
        skipPrevious(dispatch).catch(console.error);
        setPercentage(0);
        setDuration(0);
        setCurrentTime(0);
    };

    const handleSkipBackward = async () => {
        const audio = audioRef.current;
        audio.currentTime = audio.currentTime - 15;
        // console.log(audio.currenTime);
        // console.log(currentTrack);

        if (currentTrack?.trackType === 'episode') {
            let payload = {
                track: currentTrack?.track,
                podcast: currentTrack?.detailPodcast._id,
                offset: parseInt(audio.currentTime),
            };
            setListeningTrack(dispatch, payload).catch(console.error);
        }
    };
    const handleSkipForward = async () => {
        const audio = audioRef.current;
        audio.currentTime = audio.currentTime + 15;
        // console.log(audio.currentTime);

        if (currentTrack?.trackType === 'episode') {
            let payload = {
                track: currentTrack?.track,
                podcast: currentTrack?.detailPodcast._id,
                offset: parseInt(audio.currentTime),
            };
            setListeningTrack(dispatch, payload).catch(console.error);
        }
    };

    const handleEndedTrack = async (e) => {
        if (repeat === 'repeat-one' && isPlaying) {
            audioRef.current.currentTime = 0;
            audioRef.current.play();
        } else if (repeat === 'repeat' && isPlaying) {
            if (currentTrack?.trackType === 'episode') {
                let payload = {
                    track: currentTrack?.track,
                    podcast: currentTrack?.detailPodcast._id,
                    offset: parseInt(duration) + 15,
                };
                await setListeningTrack(dispatch, payload).catch(console.error);
            }
            await handleSkipNext().catch(console.error);
        } else {
            if (currentTrack?.trackType === 'episode') {
                let payload = {
                    track: currentTrack?.track,
                    podcast: currentTrack?.detailPodcast._id,
                    offset: parseInt(duration) + 15,
                };
                await setListeningTrack(dispatch, payload).catch(console.error);
            }
            await handleSkipNext().catch(console.error);
        }

        // if (repeat === 'none' && isPlaying && currentTrack?.position) {
        //     await handleSkipNext().catch(console.error);
        //     await pauseTrack(dispatch).catch(console.error);
        // }
    };

    const handleToggleLyric = () => {
        if (location.pathname === routes.lyrics) {
            navigate(-1);
        } else {
            navigate(routes.lyrics);
        }
    };

    const handleToggleQueue = () => {
        if (location.pathname === routes.queue) {
            navigate(-1);
        } else {
            navigate(routes.queue);
        }
    };

    useEffect(() => {
        getAudioPlayerState(dispatch).catch(console.error);

        // console.log(currentTrack);
        // console.log(update);
    }, [dispatch, update]);

    useEffect(() => {
        getCurrentlyPlayingTrack(dispatch).catch(console.error);
        // console.log(update);
    }, [dispatch, update]);

    useEffect(() => {
        if (isPlaying) {
            audioRef.current.play();
            // audioRef.current.muted = false;
        } else {
            audioRef.current.pause();
        }
    }, [dispatch, isPlaying]);

    useEffect(() => {
        audioRef.current.volume = volume / 100.0;
    }, [dispatch, volume]);

    const setListeningTrackTimeout = async () => {
        if (currentTrack.trackType === 'episode' && isPlaying === true) {
            console.log('run' + isPlaying);
            let payload = {
                track: currentTrack.track,
                podcast: currentTrack.detailPodcast._id,
                offset: parseInt(audioRef.current.currentTime),
            };
            // console.log(parseInt(currentTime));
            await setListeningTrack(dispatch, payload).catch(console.error);
        }
    };

    const handleLoadedData = async (e) => {
        if (currentTrack.trackType === 'episode') {
            const res = await getCurrentPlayingTime(dispatch, {
                params: {
                    track: currentTrack.track,
                    podcast: currentTrack.podcast,
                },
            });
            // console.log(res);
            audioRef.current.currentTime = parseInt(res.data.currentListeningTime) || 0;
        }
        setDuration(e.currentTarget?.duration.toFixed(2));
    };

    useEffect(() => {
        let myInterval = setInterval(setListeningTrackTimeout, 15000);

        // console.log(myInterval);
        return () => clearInterval(myInterval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentTrack?.track, isPlaying]);

    return (
        <div className={cx('container')}>
            <audio
                src={currentTrack?.detailTrack?.audio}
                // src={trackSrc}
                ref={audioRef}
                onTimeUpdate={getCurrDuration}
                onLoadedData={handleLoadedData}
                onEnded={handleEndedTrack}
                autoPlay={isPlaying}
                // muted
            />
            <div className={cx('start')}>
                <div className={cx('image')}>
                    <Avatar
                        src={currentTrack?.detailTrack?.image}
                        alt='Tac'
                        variant='square'
                        sx={{ width: '60px', height: '60px' }}
                    />
                </div>
                <div className={cx('info')}>
                    <div className={cx('name')}>
                        {currentTrack?.trackType === 'episode' ? (
                            <Link to={`/podcast/${currentTrack?.podcast}`}>{currentTrack?.detailTrack?.name}</Link>
                        ) : (
                            <Link to={`/album/${currentTrack?.album}`}>{currentTrack?.detailTrack?.name}</Link>
                        )}
                    </div>
                    <div className={cx('artists')}>
                        {currentTrack?.detailTrack?.artists.map((artist, index) => {
                            return (
                                <span key={index}>
                                    {index !== 0 ? ', ' : ''}

                                    {currentTrack?.trackType === 'episode' ? (
                                        <Link to={`/podcaster/${artist.id}`}>{artist.name}</Link>
                                    ) : (
                                        <Link to={`/artist/${artist.id}`}>{artist.name}</Link>
                                    )}
                                </span>
                            );
                        })}
                    </div>
                </div>
                <div className={cx('like')}>
                    {currentTrack?.trackType === 'episode' ? (
                        <Like
                            type='episode'
                            size='normal'
                            trackId={currentTrack?.detailTrack?._id}
                            podcastId={currentTrack?.detailPodcast?._id}
                        />
                    ) : (
                        <Like
                            type='track'
                            size='normal'
                            trackId={currentTrack?.detailTrack?._id}
                            albumId={currentTrack?.detailAlbum?._id}
                        />
                    )}
                </div>
            </div>
            <div className={cx('center')}>
                <div className={cx('audio-controls')}>
                    {currentTrack?.trackType === 'episode' ? (
                        <IconButton className={cx('control-btn')} onClick={handleSkipBackward} disableRipple>
                            <SkipBackwardCustomIcon classNamesCus={cx('control')} number={15} />
                        </IconButton>
                    ) : (
                        <IconButton className={cx('control-btn')} onClick={handleToggleShuffle} disableRipple>
                            <ShuffleIcon className={cx('control', { active: shuffle === 'shuffle' })} />
                        </IconButton>
                    )}

                    <IconButton className={cx('control-btn')} onClick={handleSkipPrevious} disableRipple>
                        <SkipPreviousIcon className={cx('control')} />
                    </IconButton>
                    <IconButton className={cx('play-btn')} onClick={handleTogglePlay} disableRipple>
                        {isPlaying ? (
                            <PauseCircleIcon className={cx('control')} />
                        ) : (
                            <PlayCircleIcon className={cx('control')} />
                        )}
                    </IconButton>
                    <IconButton className={cx('control-btn')} onClick={handleSkipNext} disableRipple>
                        <SkipNextIcon className={cx('control')} />
                    </IconButton>
                    {currentTrack?.trackType === 'episode' ? (
                        <IconButton className={cx('control-btn')} onClick={handleSkipForward} disableRipple>
                            <SkipForwardCustomIcon classNamesCus={cx('control')} number={15} />
                        </IconButton>
                    ) : (
                        <IconButton className={cx('control-btn')} onClick={handleToggleRepeatMode} disableRipple>
                            {repeat === 'repeat-one' ? (
                                <RepeatOneIcon className={cx('control', 'active')} />
                            ) : (
                                <RepeatIcon className={cx('control', { active: repeat === 'repeat' })} />
                            )}
                        </IconButton>
                    )}
                </div>
                <div className={cx('track-progress')}>
                    <span className={cx('timer')}>{fancyTimeFormat(currentTime)}</span>
                    <TrackProgressBar percentage={percentage} onChangeAudio={onChangeAudio} />
                    <span className={cx('timer')}>{fancyTimeFormat(duration)}</span>
                </div>
            </div>
            <div className={cx('end')}>
                <div className={cx('lyric')}>
                    <IconButton className={cx('control-btn')} onClick={handleToggleLyric} disableRipple>
                        <MicExternalOnIcon className={cx('control', { active: location.pathname === routes.lyrics })} />
                    </IconButton>
                </div>
                <div className={cx('queue')}>
                    <IconButton className={cx('control-btn')} onClick={handleToggleQueue} disableRipple>
                        <QueueMusicIcon className={cx('control', { active: location.pathname === routes.queue })} />
                    </IconButton>
                </div>
                <VolumeControl volume={volume} onChangeVolume={onChangeVolume} />
            </div>
        </div>
    );
};

export default AudioPlayer;
