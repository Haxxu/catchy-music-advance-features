import React from 'react';
import { NavLink, Route, Routes, useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import { useTranslation } from 'react-i18next';

import PodcastForm from '~/components/Forms/PodcastForm';
import EpisodesOfPodcast from '~/pages/podcasterdashboard/EpisodesOfPodcast';
import { routes } from '~/config';
import styles from './styles.scoped.scss';

const cx = classNames.bind(styles);

const SpecifiedPodcast = () => {
    const { id } = useParams();
    const { t } = useTranslation();

    return (
        <div className={cx('container')}>
            {id !== 'new-podcast' && (
                <div className={cx('subnav')}>
                    <NavLink
                        end
                        className={cx('subnav-item')}
                        to={routes.podcaster_managePodcast_specifiedPodcast_nested_edit}
                    >
                        {t('Edit')}
                    </NavLink>
                    <NavLink
                        className={cx('subnav-item')}
                        to={routes.podcaster_managePodcast_specifiedPodcast_nested_episodesOfPodcast}
                    >
                        {t('Episodes')}
                    </NavLink>
                </div>
            )}
            <div className={cx('main')}>
                <Routes>
                    <Route path='' element={<PodcastForm />} />
                    {id !== 'new-podcast' && <Route path='episodes' element={<EpisodesOfPodcast />} />}
                </Routes>
            </div>
        </div>
    );
};

export default SpecifiedPodcast;
