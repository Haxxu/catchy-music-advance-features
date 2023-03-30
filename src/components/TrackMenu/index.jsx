import React, { useState } from 'react';
import classNames from 'classnames/bind';
import { useDispatch } from 'react-redux';
import { ClickAwayListener, Divider, IconButton, Paper, Popper } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import GoToArtistMenu from '~/components/GoToArtistMenu';
import styles from './styles.module.scss';
import axiosInstance from '~/api/axiosInstance';
import { addItemsToQueueUrl, removeItemsFromQueueUrl } from '~/api/urls/me';
import AddToPlaylistMenu from '~/components/AddToPlaylistMenu';
import { removeLikedTrackFromLibraryUrl, removeLikedEpisodeFromLibraryUrl } from '~/api/urls/me';
import { updateLikeTrackState, updatePlaylistState, updateQueueState } from '~/redux/updateStateSlice';
import { removeTrackFromPlaylistUrl } from '~/api/urls/playlistsUrl';
import { useAuth } from '~/hooks';
import { useTranslation } from 'react-i18next';

const cx = classNames.bind(styles);

const TrackMenu = ({
    trackId,
    albumId,
    playlistId,
    podcastId,
    trackType = 'song',
    artists,
    context_uri,
    position,
    inPage = 'playlist',
    order,
    playlistOwnerId,
    albumOwnerId,
    podcastOwnerId,
}) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { userId } = useAuth();
    const { t } = useTranslation();

    const handleClick = (e) => {
        setAnchorEl(anchorEl ? null : e.currentTarget);
    };

    const handleClickAway = () => {
        setAnchorEl(null);
    };

    const addTrackToQueue = async () => {
        try {
            console.log({ context_uri, position });
            const { data } = await axiosInstance.post(addItemsToQueueUrl, { items: [{ context_uri, position }] });
            toast.success(data.message);
            setAnchorEl(null);
            dispatch(updateQueueState());
        } catch (err) {
            console.log(err);
        }
    };

    const removeTrackFromQueue = async () => {
        try {
            const { data } = await axiosInstance.delete(removeItemsFromQueueUrl, {
                data: {
                    items: [{ context_uri, position, order }],
                },
            });
            toast.success(data.message);
            setAnchorEl(null);
            dispatch(updateQueueState());
        } catch (err) {
            console.log(err);
        }
    };

    const goToTrackPage = () => {
        navigate(`/track/${trackId}/album/${albumId}`);
    };

    const goToAlbumPage = () => {
        navigate(`/album/${albumId}`);
    };

    const removeTrackFromLikedTracks = async (trackId, albumId) => {
        try {
            const { data } = await axiosInstance.delete(removeLikedTrackFromLibraryUrl, {
                data: { track: trackId, album: albumId },
            });
            dispatch(updateLikeTrackState());
            toast.success(data.message);
        } catch (err) {
            console.log(err);
        }
    };

    const removeEpisodeFromLikedEpisodes = async (trackId, podcastId) => {
        try {
            const { data } = await axiosInstance.delete(removeLikedEpisodeFromLibraryUrl, {
                data: { track: trackId, podcast: podcastId },
            });
            dispatch(updateLikeTrackState());
            toast.success(data.message);
        } catch (err) {
            console.log(err);
        }
    };

    const removeTrackFromPlaylist = async (trackId, albumId) => {
        try {
            const { data } = await axiosInstance.delete(removeTrackFromPlaylistUrl(playlistId), {
                data: { track: trackId, album: albumId },
            });
            dispatch(updatePlaylistState());
            setAnchorEl(null);
            toast.success(data.message);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className={cx('container')} onDoubleClick={(e) => e.stopPropagation()}>
            <IconButton onClick={handleClick} disableRipple sx={{ padding: 0 }}>
                <MoreHorizIcon sx={{ color: 'var(--text-primary)', width: '20px', height: '20px', padding: 0 }} />
            </IconButton>
            <Popper placement='left-start' open={Boolean(anchorEl)} anchorEl={anchorEl} sx={{ zIndex: 9999 }}>
                <ClickAwayListener onClickAway={handleClickAway}>
                    <Paper className={cx('menu-container')}>
                        <div className={cx('menu-list')}>
                            <div className={cx('menu-item')} onClick={addTrackToQueue}>
                                {t('Add to queue')}
                            </div>
                            {inPage === 'queue' && (
                                <div className={cx('menu-item')} onClick={removeTrackFromQueue}>
                                    {t('Remove from queue')}
                                </div>
                            )}
                            <div className={cx('menu-item', 'item-have-sub-menu')}>
                                <AddToPlaylistMenu trackId={trackId} albumId={albumId} />
                            </div>
                            <Divider />
                            <div className={cx('menu-item')} onClick={goToTrackPage}>
                                {t('Go to track')}
                            </div>
                            <div className={cx('menu-item', 'item-have-sub-menu')}>
                                <GoToArtistMenu artists={artists} />
                            </div>
                            <div className={cx('menu-item')} onClick={goToAlbumPage}>
                                {t('Go to album')}
                            </div>
                            <Divider />
                            {inPage === 'liked-tracks' && (
                                <div
                                    className={cx('menu-item')}
                                    onClick={() => removeTrackFromLikedTracks(trackId, albumId)}
                                >
                                    {t('Remove from your liked tracks')}
                                </div>
                            )}
                            {inPage === 'liked-episodes' && (
                                <div
                                    className={cx('menu-item')}
                                    onClick={() => removeEpisodeFromLikedEpisodes(trackId, podcastId)}
                                >
                                    {t('Remove from your liked episodes')}
                                </div>
                            )}
                            {inPage === 'playlist' && playlistOwnerId === userId && (
                                <div
                                    className={cx('menu-item')}
                                    onClick={() => removeTrackFromPlaylist(trackId, albumId)}
                                >
                                    {t('Remove track from this playlist')}
                                </div>
                            )}
                        </div>
                    </Paper>
                </ClickAwayListener>
            </Popper>
        </div>
    );
};

export default TrackMenu;
