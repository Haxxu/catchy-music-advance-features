import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import CircularProgress from '@mui/material/CircularProgress';

import { nFormatter } from '~/utils/Format';
import { getArtistByIdUrl } from '~/api/urls/artistsUrl';
import styles from './styles.scoped.scss';
import { Grid } from '@mui/material';
import axiosInstance from '~/api/axiosInstance';
import { useAuth } from '~/hooks';

const cx = classNames.bind(styles);

const Dashboard = () => {
    const [artistInfo, setArtistInfo] = useState(null);
    const { userId } = useAuth();
    const { t } = useTranslation();

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await axiosInstance.get(getArtistByIdUrl(userId), {
                params: { context: 'detail' },
            });

            setArtistInfo(data.data);
        };

        fetchData().catch(console.error);
    }, [userId]);

    return (
        <div className={cx('container')}>
            <div className={cx('header')}>
                <h2>{t('Welcome back!')}</h2>
            </div>
            {artistInfo ? (
                <Grid container spacing={3}>
                    <Grid item xs={12} lg={6}>
                        <div className={cx('info')}>
                            <div className={cx('left')}>
                                <div className={cx('title')}>{t('Followers')}</div>
                                <div className={cx('new-today')}>
                                    <span className={cx('number')}>{nFormatter(artistInfo.followers.total)}</span>
                                </div>
                                <div className={cx('bottom-title')}>{t('Total Followers')}</div>
                            </div>
                            <div className={cx('right')}>
                                <div className={cx('detail-info')}>
                                    {t('New followers today')}:{' '}
                                    <span className={cx('number')}>
                                        {nFormatter(artistInfo.followers.newFollowersToday)}
                                    </span>
                                </div>
                                <div className={cx('detail-info')}>
                                    {t('New followers this month')}:{' '}
                                    <span className={cx('number')}>
                                        {nFormatter(artistInfo.followers.newFollowersThisMonth)}
                                    </span>
                                </div>
                                <div className={cx('detail-info')}>
                                    {t('New followers last month')}:{' '}
                                    <span className={cx('number')}>
                                        {nFormatter(artistInfo.followers.newFollowersLastMonth)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        <div className={cx('info')}>
                            <div className={cx('left')}>
                                <div className={cx('title')}>{t('Tracks')}</div>
                                <div className={cx('new-today')}>
                                    <span className={cx('number')}>{artistInfo.tracks.total}</span>
                                </div>
                                <div className={cx('bottom-title')}>{t('Total Tracks')}</div>
                            </div>
                            <div className={cx('right')}>
                                <div className={cx('detail-info')}>
                                    {t('Total tracks play')}:{' '}
                                    <span className={cx('number')}>{nFormatter(artistInfo.tracks.totalPlays)}</span>
                                </div>
                                <div className={cx('detail-info')}>
                                    {t('Total tracks saved')}:{' '}
                                    <span className={cx('number')}>{artistInfo.tracks.totalSaved}</span>
                                </div>
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        <div className={cx('info')}>
                            <div className={cx('left')}>
                                <div className={cx('title')}>{t('Albums')}</div>
                                <div className={cx('new-today')}>
                                    <span className={cx('number')}>{artistInfo.albums.total}</span>
                                </div>
                                <div className={cx('bottom-title')}>{t('Total Albums')}</div>
                            </div>
                            <div className={cx('right')}>
                                <div className={cx('detail-info')}>
                                    {t('Total released albums')}:{' '}
                                    <span className={cx('number')}>
                                        {nFormatter(artistInfo.albums.totalReleasedAlbums)}
                                    </span>
                                </div>
                                <div className={cx('detail-info')}>
                                    {t('Total album saved')}:{' '}
                                    <span className={cx('number')}>{artistInfo.albums.totalSaved}</span>
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
