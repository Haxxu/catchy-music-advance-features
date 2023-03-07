import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import { Avatar, IconButton } from '@mui/material';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';

import image from '~/assets/images/anh_test.jpg';
import unknownPlaylistImg from '~/assets/images/playlist_unknown.jpg';
import styles from './styles.scoped.scss';
import { playTrack, pauseTrack } from '~/api/audioPlayer';
import { useDispatch, useSelector } from 'react-redux';
import { updateTrack } from '~/redux/audioPlayerSlice';

const cx = classNames.bind(styles);

const LikedTracksItem = ({ type = 'default', playlist, to }) => {
    const [activePlayBtn, setActivePlayBtn] = useState(false);
    const { context, isPlaying } = useSelector((state) => state.audioPlayer);

    const dispatch = useDispatch();

    const handlePlayTrack = async () => {
        playTrack(dispatch, playlist.firstTrack).catch(console.error);
        dispatch(updateTrack());
    };

    const handleTogglePlay = async () => {
        if (isPlaying) {
            pauseTrack(dispatch).catch(console.error);
        } else {
            playTrack(dispatch).catch(console.error);
        }
    };

    return (
        <>
            {type === 'reduce' ? (
                <div
                    className={cx('container-reduce')}
                    onMouseEnter={() => setActivePlayBtn(true)}
                    onMouseLeave={() => setActivePlayBtn(false)}
                >
                    <Link className={cx('playlist-link')} to={to}>
                        <div className={cx('playlist')}>
                            <Avatar
                                className={cx('image')}
                                variant='square'
                                src={image}
                                alt='anh'
                                sx={{ width: '75px', height: '75px' }}
                            />
                            <div className={cx('info')}>
                                Bài hát yêu thích
                                <p className={cx('name')} />
                            </div>
                        </div>
                    </Link>
                    <IconButton className={cx('reduce-play-btn', { active: activePlayBtn })} disableRipple>
                        <PlayCircleIcon
                            sx={{
                                width: '50px',
                                height: '50px',
                            }}
                        />
                    </IconButton>
                </div>
            ) : (
                <div
                    className={cx('container')}
                    onMouseEnter={() => setActivePlayBtn(true)}
                    onMouseLeave={() => setActivePlayBtn(false)}
                >
                    <Link className={cx('playlist-img-link')} to={to}>
                        <img
                            className={cx('image', { active: activePlayBtn })}
                            src={playlist.image.trim() === '' ? unknownPlaylistImg : playlist.image}
                            alt={playlist.name}
                        />
                    </Link>
                    <div className={cx('info')}>
                        <Link className={cx('playlist-link')} to={to}>
                            <p className={cx('name')}>{playlist.name}</p>
                        </Link>
                        <div className={cx('detail')}>
                            <div className={cx('description')}>{playlist.description}</div>
                        </div>
                    </div>
                    {context.contextType === 'playlist' && context.contextId === playlist._id ? (
                        <IconButton
                            className={cx('play-btn', { active: activePlayBtn || isPlaying })}
                            disableRipple
                            onClick={handleTogglePlay}
                        >
                            {isPlaying ? (
                                <PauseCircleIcon
                                    className={cx('control')}
                                    sx={{
                                        width: '50px',
                                        height: '50px',
                                    }}
                                />
                            ) : (
                                <PlayCircleIcon
                                    className={cx('control')}
                                    sx={{
                                        width: '50px',
                                        height: '50px',
                                    }}
                                />
                            )}
                        </IconButton>
                    ) : (
                        <IconButton
                            className={cx('play-btn', { active: activePlayBtn })}
                            disableRipple
                            onClick={handlePlayTrack}
                        >
                            <PlayCircleIcon
                                sx={{
                                    width: '50px',
                                    height: '50px',
                                }}
                            />
                        </IconButton>
                    )}
                </div>
            )}
        </>
    );
};

export default LikedTracksItem;
