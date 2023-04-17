import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IconButton } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import classNames from 'classnames/bind';

import styles from './styles.scoped.scss';
import axiosInstance from '~/api/axiosInstance';
import {
    checkLikedTrackUrl,
    checkLikedEpisodeUrl,
    checkSavedAlbumUrl,
    checkSavedPlaylistUrl,
    saveTrackToLibraryUrl,
    removeLikedTrackFromLibraryUrl,
    saveAlbumToLibraryUrl,
    removeAlbumFromLibraryUrl,
    savePlaylistToLibraryUrl,
    removePlaylistFromLibraryUrl,
    saveEpisodeToLibraryUrl,
    removeLikedEpisodeFromLibraryUrl,
    removePodcastFromLibraryUrl,
    savePodcastToLibraryUrl,
    checkSavedPodcastUrl,
} from '~/api/urls/me';
import {
    updateLikeTrackState,
    updateLikeEpisodeState,
    updatePlaylistInSidebarState,
    updatePlaylistState,
    updateAlbumState,
    updatePodcastState,
    updateQueueState,
} from '~/redux/updateStateSlice';
import { toast } from 'react-toastify';
import { useAuth } from '~/hooks';
import { likeComment, unlikeComment } from '~/api/comment';
import { likePost, unlikePost } from '~/api/post';

const cx = classNames.bind(styles);

const Like = ({ type = 'track', size = 'normal', trackId, albumId, playlistId, podcastId, comment, post }) => {
    const [liked, setLiked] = useState(false);
    const { userId } = useAuth();

    const { likeTrackState, playlistInSidebarState, likeEpisodeState } = useSelector((state) => state.updateState);

    const dispatch = useDispatch();

    const handleLike = async () => {
        try {
            if (liked) {
                if (type === 'track') {
                    const { data } = await axiosInstance.delete(removeLikedTrackFromLibraryUrl, {
                        data: { track: trackId, album: albumId },
                    });
                    setLiked(data.data);
                    dispatch(updateLikeTrackState());
                    dispatch(updateQueueState());
                    toast.success(data.message);
                } else if (type === 'album') {
                    const { data } = await axiosInstance.delete(removeAlbumFromLibraryUrl, {
                        data: { album: albumId },
                    });
                    setLiked(data.data);
                    dispatch(updateAlbumState());
                    toast.success(data.message);
                } else if (type === 'episode') {
                    const { data } = await axiosInstance.delete(removeLikedEpisodeFromLibraryUrl, {
                        data: { track: trackId, podcast: podcastId },
                    });
                    setLiked(data.data);
                    dispatch(updateLikeEpisodeState());
                    dispatch(updateQueueState());
                    toast.success(data.message);
                } else if (type === 'podcast') {
                    const { data } = await axiosInstance.delete(removePodcastFromLibraryUrl, {
                        data: { podcast: podcastId },
                    });
                    setLiked(data.data);
                    dispatch(updatePodcastState());
                    toast.success(data.message);
                } else if (type === 'comment') {
                    await unlikeComment(dispatch, comment);
                } else if (type === 'post') {
                    await unlikePost(dispatch, post);
                } else {
                    const { data } = await axiosInstance.delete(removePlaylistFromLibraryUrl, {
                        data: { playlist: playlistId },
                    });
                    setLiked(data.data);
                    dispatch(updatePlaylistInSidebarState());
                    dispatch(updatePlaylistState());
                    toast.success(data.message);
                }
            } else {
                if (type === 'track') {
                    const { data } = await axiosInstance.put(saveTrackToLibraryUrl, { track: trackId, album: albumId });
                    setLiked(data.data);
                    dispatch(updateLikeTrackState());
                    dispatch(updateQueueState());
                    toast.success(data.message);
                } else if (type === 'album') {
                    const { data } = await axiosInstance.put(saveAlbumToLibraryUrl, { album: albumId });
                    setLiked(data.data);
                    dispatch(updateAlbumState());
                    toast.success(data.message);
                } else if (type === 'episode') {
                    const { data } = await axiosInstance.put(saveEpisodeToLibraryUrl, {
                        track: trackId,
                        podcast: podcastId,
                    });
                    setLiked(data.data);
                    dispatch(updateLikeEpisodeState());
                    dispatch(updateQueueState());
                    toast.success(data.message);
                } else if (type === 'podcast') {
                    const { data } = await axiosInstance.put(savePodcastToLibraryUrl, { podcast: podcastId });
                    setLiked(data.data);
                    dispatch(updatePodcastState());
                    toast.success(data.message);
                } else if (type === 'comment') {
                    await likeComment(dispatch, comment);
                } else if (type === 'post') {
                    await likePost(dispatch, post);
                } else {
                    // playlist
                    const { data } = await axiosInstance.put(savePlaylistToLibraryUrl, { playlist: playlistId });
                    setLiked(data.data);
                    dispatch(updatePlaylistInSidebarState());
                    dispatch(updatePlaylistState());
                    toast.success(data.message);
                }
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            if (type === 'track') {
                const { data } = await axiosInstance.get(checkLikedTrackUrl, { params: { trackId, albumId } });
                setLiked(data.data);
            } else if (type === 'album') {
                const { data } = await axiosInstance.get(checkSavedAlbumUrl, { params: { albumId } });
                setLiked(data.data);
            } else if (type === 'podcast') {
                const { data } = await axiosInstance.get(checkSavedPodcastUrl, { params: { podcastId } });
                setLiked(data.data);
            } else if (type === 'episode') {
                const { data } = await axiosInstance.get(checkLikedEpisodeUrl, { params: { trackId, podcastId } });
                setLiked(data.data);
            } else if (type === 'comment') {
                if (comment.likes.map((item) => item.user).includes(userId)) {
                    setLiked(true);
                } else {
                    setLiked(false);
                }
            } else if (type === 'post') {
                if (post.likes.map((item) => item.user).includes(userId)) {
                    setLiked(true);
                } else {
                    setLiked(false);
                }
            } else {
                // playlist
                const { data } = await axiosInstance.get(checkSavedPlaylistUrl, { params: { playlistId } });
                setLiked(data.data);
            }
        };

        fetchData().catch(console.error);
        // eslint-disable-next-line
    }, [
        liked,
        trackId,
        albumId,
        playlistId,
        podcastId,
        likeTrackState,
        likeEpisodeState,
        playlistInSidebarState,
        comment,
        post,
    ]);

    return (
        <IconButton className={cx('like-btn')} onClick={handleLike} disableRipple>
            {liked ? (
                type === 'episode' ? (
                    <CheckCircleIcon
                        className={cx('like-filled', { large: size === 'large', medium: size === 'medium' })}
                    />
                ) : (
                    <FavoriteIcon
                        className={cx('like-filled', { large: size === 'large', medium: size === 'medium' })}
                    />
                )
            ) : type === 'episode' ? (
                <AddCircleOutlineIcon
                    className={cx('like-outlined', { large: size === 'large', medium: size === 'medium' })}
                />
            ) : (
                <FavoriteBorderIcon
                    className={cx('like-outlined', { large: size === 'large', medium: size === 'medium' })}
                />
            )}
        </IconButton>
    );
};

export default Like;
