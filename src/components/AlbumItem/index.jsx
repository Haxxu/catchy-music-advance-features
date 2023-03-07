import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import { Avatar, IconButton } from '@mui/material';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';

import unknownPlaylistImg from '~/assets/images/playlist_unknown.jpg';
import styles from './styles.scoped.scss';
import { playTrack, pauseTrack } from '~/api/audioPlayer';
import { useDispatch, useSelector } from 'react-redux';
import { updateTrack } from '~/redux/audioPlayerSlice';

const cx = classNames.bind(styles);

const AlbumItem = ({ type = 'default', album, to }) => {
    const [activePlayBtn, setActivePlayBtn] = useState(false);
    const { context, isPlaying } = useSelector((state) => state.audioPlayer);

    const dispatch = useDispatch();

    const handlePlayTrack = async () => {
        playTrack(dispatch, album.firstTrack).catch(console.error);
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
                    <Link className={cx('album-link')} to={to}>
                        <div className={cx('album')}>
                            <Avatar
                                className={cx('image')}
                                variant='square'
                                src={album?.image.trim() === '' ? unknownPlaylistImg : album?.image}
                                alt={album?.name}
                                sx={{ width: '75px', height: '75px' }}
                            />
                            <div className={cx('info')}>
                                <p className={cx('name')}>{album?.name}</p>
                            </div>
                        </div>
                    </Link>
                    {context?.contextType === 'album' && context?.contextId === album._id ? (
                        <IconButton
                            className={cx('reduce-play-btn', { active: activePlayBtn || isPlaying })}
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
                            className={cx('reduce-play-btn', { active: activePlayBtn })}
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
            ) : (
                <div
                    className={cx('container')}
                    onMouseEnter={() => setActivePlayBtn(true)}
                    onMouseLeave={() => setActivePlayBtn(false)}
                >
                    <Link className={cx('album-img-link')} to={to}>
                        <img
                            className={cx('image', { active: activePlayBtn })}
                            src={album?.image.trim() === '' ? unknownPlaylistImg : album?.image}
                            alt={album?.name}
                        />
                    </Link>
                    <div className={cx('info')}>
                        <Link className={cx('album-link')} to={to}>
                            <p className={cx('name')}>{album?.name}</p>
                        </Link>
                        <div className={cx('detail')}>
                            {/* <div className={cx('description')}>{album?.description}</div> */}
                            <Link className={cx('artist')} to={`/artist/${album?.owner?._id}`}>
                                {album?.owner?.name}
                            </Link>
                        </div>
                    </div>
                    {context?.contextType === 'album' && context?.contextId === album?._id ? (
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

export default AlbumItem;
