import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import CircularProgress from '@mui/material/CircularProgress';
import { Grid } from '@mui/material';

import { nFormatter } from '~/utils/Format';
import { getPodcasterByIdUrl } from '~/api/urls/podcastersUrl';
import styles from './styles.scoped.scss';
import axiosInstance from '~/api/axiosInstance';
import { useAuth } from '~/hooks';

const cx = classNames.bind(styles);

const Dashboard = () => {
    const [podcasterInfo, setPodcasterInfo] = useState(null);
    const { userId } = useAuth();
    const { t } = useTranslation();

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await axiosInstance.get(getPodcasterByIdUrl(userId), {
                params: { context: 'detail' },
            });

            setPodcasterInfo(data.data);
            // console.log(data.data);
        };

        fetchData().catch(console.error);
    }, [userId]);

    return (
        <div className={cx('container')}>
            <div className={cx('header')}>
                <h2>{t('Welcome back!')}</h2>
            </div>
            {podcasterInfo ? (
                <Grid container spacing={3}>
                    <Grid item xs={12} lg={6}>
                        <div className={cx('info')}>
                            <div className={cx('left')}>
                                <div className={cx('title')}>{t('Followers')}</div>
                                <div className={cx('new-today')}>
                                    <span className={cx('number')}>{nFormatter(podcasterInfo.followers.total)}</span>
                                </div>
                                <div className={cx('bottom-title')}>{t('Total Followers')}</div>
                            </div>
                            <div className={cx('right')}>
                                <div className={cx('detail-info')}>
                                    {t('New followers today')}:{' '}
                                    <span className={cx('number')}>
                                        {nFormatter(podcasterInfo.followers.newFollowersToday)}
                                    </span>
                                </div>
                                <div className={cx('detail-info')}>
                                    {t('New followers this month')}:{' '}
                                    <span className={cx('number')}>
                                        {nFormatter(podcasterInfo.followers.newFollowersThisMonth)}
                                    </span>
                                </div>
                                <div className={cx('detail-info')}>
                                    {t('New followers last month')}:{' '}
                                    <span className={cx('number')}>
                                        {nFormatter(podcasterInfo.followers.newFollowersLastMonth)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        <div className={cx('info')}>
                            <div className={cx('left')}>
                                <div className={cx('title')}>{t('Episodes')}</div>
                                <div className={cx('new-today')}>
                                    <span className={cx('number')}>{podcasterInfo.episodes.total}</span>
                                </div>
                                <div className={cx('bottom-title')}>{t('Total Episodes')}</div>
                            </div>
                            <div className={cx('right')}>
                                <div className={cx('detail-info')}>
                                    {t('Total episodes play')}:{' '}
                                    <span className={cx('number')}>
                                        {nFormatter(podcasterInfo.episodes.totalPlays)}
                                    </span>
                                </div>
                                <div className={cx('detail-info')}>
                                    {t('Total episodes saved')}:{' '}
                                    <span className={cx('number')}>{podcasterInfo.episodes.totalSaved}</span>
                                </div>
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        <div className={cx('info')}>
                            <div className={cx('left')}>
                                <div className={cx('title')}>{t('Podcasts')}</div>
                                <div className={cx('new-today')}>
                                    <span className={cx('number')}>{podcasterInfo.podcasts.total}</span>
                                </div>
                                <div className={cx('bottom-title')}>{t('Total Podcasts')}</div>
                            </div>
                            <div className={cx('right')}>
                                <div className={cx('detail-info')}>
                                    {t('Total released podcasts')}:{' '}
                                    <span className={cx('number')}>
                                        {nFormatter(podcasterInfo.podcasts.totalReleasedPodcasts)}
                                    </span>
                                </div>
                                <div className={cx('detail-info')}>
                                    {t('Total podcasts saved')}:{' '}
                                    <span className={cx('number')}>{podcasterInfo.podcasts.totalSaved}</span>
                                </div>
                            </div>
                        </div>
                    </Grid>
                </Grid>
            ) : (
                <CircularProgress color='primary' />
            )}
        </div>
    );
};

export default Dashboard;
