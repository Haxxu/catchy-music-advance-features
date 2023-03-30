import React from 'react';
import classNames from 'classnames/bind';
import { NavLink, Route, Routes } from 'react-router-dom';

import styles from './styles.scoped.scss';
import { routes } from '~/config';
import SavedPlaylists from '~/pages/SavedPlaylists';
import SavedAlbums from '~/pages/SavedAlbums';
import SavedPodcasts from '~/pages/SavedPodcasts';
import FollowingArtists from '~/pages/FollowingArtists';
import { useTranslation } from 'react-i18next';

const cx = classNames.bind(styles);

const Library = () => {
    const { t } = useTranslation();

    return (
        <div className={cx('container')}>
            <div className={cx('subnav')}>
                <NavLink className={cx('subnav-item')} to={routes.library_playlists}>
                    {t('Playlists')}
                </NavLink>
                <NavLink className={cx('subnav-item')} to={routes.library_podcasts}>
                    {t('Podcasts')}
                </NavLink>
                <NavLink className={cx('subnav-item')} to={routes.library_albums}>
                    {t('Albums')}
                </NavLink>
                <NavLink className={cx('subnav-item')} to={routes.library_artists}>
                    {t('Artists')}
                </NavLink>
            </div>
            <div className={cx('main')}>
                <Routes>
                    <Route path={routes.library_playlists} element={<SavedPlaylists />} />
                    <Route path={routes.library_albums} element={<SavedAlbums />} />
                    <Route path={routes.library_podcasts} element={<SavedPodcasts />} />
                    <Route path={routes.library_artists} element={<FollowingArtists />} />
                </Routes>
            </div>
        </div>
    );
};

export default Library;
