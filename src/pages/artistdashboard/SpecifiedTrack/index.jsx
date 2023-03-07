import React from 'react';
import { NavLink, Route, Routes, useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import { useTranslation } from 'react-i18next';

import TrackForm from '~/components/Forms/TrackForm';
import AlbumsOfTrack from '~/pages/artistdashboard/AlbumsOfTrack';
import LyricsOfTrack from '~/pages/artistdashboard/LyricsOfTrack';
import LyricForm from '~/components/Forms/LyricForm';
import { routes } from '~/config';
import styles from './styles.scoped.scss';

const cx = classNames.bind(styles);

const SpecifiedTrack = () => {
    const { id } = useParams();
    const { t } = useTranslation();

    return (
        <div className={cx('container')}>
            {id !== 'new-track' && (
                <div className={cx('subnav')}>
                    <NavLink
                        end
                        className={cx('subnav-item')}
                        to={routes.artist_manageTrack_specifiedTrack_nested_edit}
                    >
                        {t('Edit')}
                    </NavLink>
                    <NavLink
                        className={cx('subnav-item')}
                        to={routes.artist_manageTrack_specifiedTrack_nested_albumsOfTrack}
                    >
                        {t('Albums')}
                    </NavLink>
                    <NavLink
                        className={cx('subnav-item')}
                        to={routes.artist_manageTrack_specifiedTrack_nested_lyricsOfTrack}
                    >
                        {t('Lyrics')}
                    </NavLink>
                </div>
            )}
            <div className={cx('main')}>
                <Routes>
                    <Route path='' element={<TrackForm />} />
                    {id !== 'new-track' && <Route path='albums' element={<AlbumsOfTrack />} />}
                    {id !== 'new-track' && <Route path='lyrics' element={<LyricsOfTrack />} />}
                    {id !== 'new-track' && <Route path='lyrics/:lyricId' element={<LyricForm />} />}
                </Routes>
            </div>
        </div>
    );
};

export default SpecifiedTrack;
