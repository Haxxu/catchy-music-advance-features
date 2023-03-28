import React from 'react';
import { NavLink, Route, Routes, useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import { useTranslation } from 'react-i18next';

import EpisodeForm from '~/components/Forms/EpisodeForm';
import PodcastsOfEpisode from '~/pages/podcasterdashboard/PodcastsOfEpisode';
// import LyricsOfTrack from '~/pages/artistdashboard/LyricsOfTrack';
// import LyricForm from '~/components/Forms/LyricForm';
import { routes } from '~/config';
import styles from './styles.scoped.scss';

const cx = classNames.bind(styles);

const SpecifiedTrack = () => {
    const { id } = useParams();
    const { t } = useTranslation();

    return (
        <div className={cx('container')}>
            {id !== 'new-episode' && (
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
                        to={routes.podcaster_manageEpisode_specifiedEpisode_nested_podcastsOfEpisode}
                    >
                        {t('Podcasts')}
                    </NavLink>
                    {/* <NavLink
                        className={cx('subnav-item')}
                        to={routes.artist_manageTrack_specifiedTrack_nested_lyricsOfTrack}
                    >
                        {t('Lyrics')}
                    </NavLink> */}
                </div>
            )}
            <div className={cx('main')}>
                <Routes>
                    <Route path='' element={<EpisodeForm />} />
                    {id !== 'new-episode' && <Route path='podcasts' element={<PodcastsOfEpisode />} />}
                    {/* {id !== 'new-episode' && <Route path='lyrics' element={<LyricsOfTrack />} />}
                    {id !== 'new-episode' && <Route path='lyrics/:lyricId' element={<LyricForm />} />} */}
                </Routes>
            </div>
        </div>
    );
};

export default SpecifiedTrack;
