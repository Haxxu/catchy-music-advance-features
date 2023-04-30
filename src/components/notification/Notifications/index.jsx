import React, { useEffect, useState } from 'react';
import { Avatar, Badge, Divider, IconButton, Paper } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import classNames from 'classnames/bind';
import { PlayCircle } from '@mui/icons-material';

import styles from './styles.module.scss';
import Like from '~/components/Like';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { playTrack } from '~/api/audioPlayer';
import { updateTrack } from '~/redux/audioPlayerSlice';
import { getNotifications } from '~/api/notification';
import { timeAgoFormat } from '~/utils/Format';
import { setNewNotifications } from '~/redux/notificationSlice';

const cx = classNames.bind(styles);

const Notifications = () => {
    const [showNotifications, setShowNotifications] = useState(false);

    const { notifications, newNotifications } = useSelector((state) => state.notification);
    const { socket } = useSelector((state) => state.socket);
    const { following } = useSelector((state) => state.user);

    const dispatch = useDispatch();

    const toggleShowNotification = () => {
        if (showNotifications === true) {
            dispatch(setNewNotifications(0));
        }
        setShowNotifications((prev) => !prev);
    };

    const handlePlayTrack = async (context_uri = '', position = 0) => {
        playTrack(dispatch, { context_uri, position }).catch(console.error);
        dispatch(updateTrack());
    };

    useEffect(() => {
        const fetchData = async () => {
            await getNotifications(dispatch);
        };

        fetchData().catch(console.error);
    }, [dispatch]);

    useEffect(() => {
        if (!socket) return;

        for (let i = 0; i < following.length; ++i) {
            socket && socket.emit('joinRoom', following[i]._id);
        }

        return () => {
            for (let i = 0; i < following.length; ++i) {
                socket.emit('outRoom', following[i]._id);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, following]);

    return (
        <div className={cx('container')}>
            <div className={cx('button')} onClick={toggleShowNotification}>
                <Badge badgeContent={newNotifications} color='primary' invisible={newNotifications === 0}>
                    <NotificationsIcon sx={{ fontSize: 28 }} color='primary' />
                </Badge>
            </div>
            {showNotifications && (
                <Paper className={cx('notifications')}>
                    {notifications.length > 0 ? (
                        notifications.map((noti, index) => (
                            <div className={cx('notification')} key={index}>
                                <div className={cx('description')}>{noti.description}</div>
                                <div className={cx('main')}>
                                    <div className={cx('left')}>
                                        <div className={cx('image')}>
                                            <Avatar
                                                variant='square'
                                                src={noti.contextObject.image}
                                                sx={{ width: 60, height: 60 }}
                                            />
                                        </div>
                                        <div className={cx('info')}>
                                            <div className={cx('date')}>{timeAgoFormat(noti.addedAt)}</div>
                                            <div className={cx('name-container')}>
                                                <Link to={noti.contextObject.url} className={cx('name')}>
                                                    {noti.contextObject.name}
                                                </Link>
                                            </div>
                                            <div className={cx('artists')}>
                                                {noti.artists.map((art, i) => (
                                                    <span key={i}>
                                                        <Link to={art.url} className={cx('artist')}>
                                                            {art.name}
                                                        </Link>
                                                        {', '}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className={cx('actions')}>
                                        <Like
                                            type={
                                                noti.type === 'new-album'
                                                    ? 'album'
                                                    : noti.type === 'new-podcast'
                                                    ? 'podcast'
                                                    : 'episode'
                                            }
                                            albumId={noti.contextObject._id}
                                            podcastId={
                                                noti.type === 'new-podcast'
                                                    ? noti.contextObject._id
                                                    : noti.playTrack.trackContextId
                                            }
                                            trackId={noti.contextObject._id}
                                        />
                                        {noti.playTrack && (
                                            <IconButton
                                                disableRipple
                                                onClick={() =>
                                                    handlePlayTrack(
                                                        noti.playTrack?.context_uri,
                                                        noti.playTrack?.position,
                                                    )
                                                }
                                            >
                                                <PlayCircle sx={{ width: 20, height: 20 }} />
                                            </IconButton>
                                        )}
                                    </div>
                                </div>
                                <Divider />
                            </div>
                        ))
                    ) : (
                        <div>No Notifications</div>
                    )}
                </Paper>
            )}
        </div>
    );
};

export default Notifications;
