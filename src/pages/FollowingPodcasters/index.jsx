import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import { Grid } from '@mui/material';

import styles from './styles.scoped.scss';
import { getFollowingUsersUrl } from '~/api/urls/me';
import axiosInstance from '~/api/axiosInstance';
import UserItem from '~/components/UserItem';
import { useTranslation } from 'react-i18next';

const cx = classNames.bind(styles);

const FollowingPodcasters = () => {
    const [podcasters, setPodcasters] = useState();
    const { t } = useTranslation();

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await axiosInstance.get(getFollowingUsersUrl);
            setPodcasters(data.data.podcasters);
            // console.log(data.data.artists);
        };

        fetchData().catch(console.error);
    }, []);

    return (
        <div className={cx('container')}>
            <section className={cx('section-container')}>
                <h1 className={cx('heading')}>{t('Podcasters')}</h1>
                <div className={cx('section-content')}>
                    <Grid container spacing={2}>
                        {podcasters?.length !== 0 &&
                            podcasters?.map((item, index) => (
                                <Grid item xl={2} lg={3} md={4} xs={6} key={index}>
                                    <UserItem
                                        name={item.name}
                                        image={item.image}
                                        type={item.type}
                                        to={`/${item?.type}/${item?._id}`}
                                    />
                                </Grid>
                            ))}
                    </Grid>
                </div>
            </section>
        </div>
    );
};

export default FollowingPodcasters;
