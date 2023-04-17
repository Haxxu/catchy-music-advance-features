import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import AddBoxIcon from '@mui/icons-material/AddBox';
import FavoriteIcon from '@mui/icons-material/Favorite';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import AddCardIcon from '@mui/icons-material/AddCard';
import FeedIcon from '@mui/icons-material/Feed';

import { routes } from '~/config';
import styles from './styles.scoped.scss';
import axiosInstance from '~/api/axiosInstance';
import { getSavedPlaylistsUrl } from '~/api/urls/me';
import { createPlaylistUrl } from '~/api/urls/playlistsUrl';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '~/hooks';
import { updatePlaylistInSidebarState } from '~/redux/updateStateSlice';
import unknownPlaylistImage from '~/assets/images/playlist_unknown.jpg';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

const cx = classNames.bind(styles);

const Sidebar = () => {
    const [playlists, setPlaylists] = useState([]);

    const { context, isPlaying } = useSelector((state) => state.audioPlayer);
    const { playlistsInSidebarState } = useSelector((state) => state.updateState);
    const { userId, name } = useAuth();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();

    const handleCreateNewPlaylist = async () => {
        try {
            let newPlaylistIndex =
                playlists.reduce(
                    (playlistOfOwnerLength, item) => (playlistOfOwnerLength += item.playlist.owner === userId ? 1 : 0),
                    0,
                ) + 1;
            const res = await axiosInstance.post(createPlaylistUrl, {
                name: `My playlist #${newPlaylistIndex}`,
                description: `By ${name}`,
                image: unknownPlaylistImage,
            });
            if (res.status === 200) {
                dispatch(updatePlaylistInSidebarState());
                toast.success(res.data.message);
                navigate(`/playlist/${res.data.data._id}`);
            } else {
                toast.error(res.data.message);
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const res = await axiosInstance.get(getSavedPlaylistsUrl);
            setPlaylists(res.data.data);
            // console.log(res);
        };

        fetchData().catch(console.error);
    }, [playlistsInSidebarState]);

    return (
        <div className={cx('container')}>
            <div className={cx('brand')}>
                <Link
                    to={'/'}
                    style={{
                        textDecoration: 'none',
                        color: 'inherit',
                        display: 'block',
                        padding: '2.5rem 0 1.5rem 1rem',
                    }}
                >
                    <h3>CATCHY MUSIC</h3>
                </Link>
            </div>
            <div className={cx('navigation')}>
                <NavLink className={({ isActive }) => cx('link', { active: isActive })} end to={routes.home}>
                    <HomeIcon />
                    <span>{t('Home')}</span>
                </NavLink>
                <NavLink className={({ isActive }) => cx('link', { active: isActive })} end to={routes.posts}>
                    <FeedIcon />
                    <span>{t('Posts')}</span>
                </NavLink>
                <NavLink className={({ isActive }) => cx('link', { active: isActive })} to={routes.search}>
                    <SearchIcon />
                    <span>{t('Search')}</span>
                </NavLink>
                <NavLink
                    className={({ isActive }) =>
                        cx('link', {
                            active:
                                isActive ||
                                location.pathname === routes.library_albums_route ||
                                location.pathname === routes.library_artists_route,
                        })
                    }
                    to={routes.library_home}
                >
                    <LibraryMusicIcon />
                    <span>{t('Library')}</span>
                </NavLink>
                <div className={cx('create-playlist-btn link')} onClick={handleCreateNewPlaylist}>
                    <AddBoxIcon />
                    <span>{t('Create playlist')}</span>
                </div>
                <NavLink className={({ isActive }) => cx('link', { active: isActive })} to={routes.managePosts}>
                    <AddCardIcon />
                    <span>{t('Manage posts')}</span>
                </NavLink>
                <NavLink className={({ isActive }) => cx('link', { active: isActive })} to={routes.likedTracks}>
                    <FavoriteIcon />
                    <span>{t('Liked tracks')}</span>
                    <span className={cx('icon')}>
                        {context && context?.contextType === 'liked' && isPlaying && <VolumeUpIcon />}
                    </span>
                </NavLink>
                <NavLink className={({ isActive }) => cx('link', { active: isActive })} to={routes.likedEpisodes}>
                    <BookmarkIcon />
                    <span>{t('Saved episodes')}</span>
                    <span className={cx('icon')}>
                        {context && context?.contextType === 'likedEpisodes' && isPlaying && <VolumeUpIcon />}
                    </span>
                </NavLink>
            </div>
            <div className={cx('playlist-container')}>
                {playlists.map(({ playlist }, index) => (
                    <NavLink
                        key={index}
                        className={({ isActive }) =>
                            cx('link', {
                                active: isActive,
                            })
                        }
                        to={'/playlist/' + playlist._id}
                    >
                        <div className={cx('name')}>
                            <span>{playlist.name}</span>
                        </div>

                        {context &&
                            context?.contextType === 'playlist' &&
                            context?.contextId === playlist._id &&
                            isPlaying && <VolumeUpIcon />}
                    </NavLink>
                ))}
            </div>
        </div>
    );
};

export default Sidebar;
