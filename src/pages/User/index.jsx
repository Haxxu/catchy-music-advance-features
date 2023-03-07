import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import { Paper, Avatar, Grid } from '@mui/material';

import { useAuth } from '~/hooks';
import axiosInstance from '~/api/axiosInstance';
import styles from './styles.scoped.scss';
import { getUserByIdUrl } from '~/api/urls/usersUrl';
import FollowButton from '~/components/FollowButton';
import PlaylistItem from '~/components/PlaylistItem';
import UserItem from '~/components/UserItem';
import UserMenu from '~/components/UserMenu';
import { useTranslation } from 'react-i18next';

const cx = classNames.bind(styles);

const User = () => {
    const [user, setUser] = useState(null);
    const { id } = useParams();
    const { userId } = useAuth();
    const { userPageState } = useSelector((state) => state.updateState);
    const { t } = useTranslation();

    useEffect(() => {
        const fetchAlbum = async () => {
            const { data } = await axiosInstance.get(getUserByIdUrl(id), { params: { detail: true } });
            setUser(data.data);
            console.log(data.data);
        };

        fetchAlbum().catch(console.error);
    }, [id, userPageState]);

    return (
        <div className={cx('container')}>
            <div className={cx('header')}>
                <div className={cx('image-container')}>
                    <Avatar
                        className={cx('image')}
                        variant='circular'
                        src={user?.image}
                        alt={user?.name}
                        sx={{ width: '240px', height: '240px' }}
                        component={Paper}
                        elevation={4}
                    />
                </div>
                <div className={cx('info')}>
                    <h2 className={cx('type')}>{t('PROFILE')}</h2>
                    <span className={cx('name')}>{user?.name}</span>
                    {/* <div className='description'>{album?.description}</div> */}
                    <div className={cx('detail')}>
                        <span className={cx('total-publicPlaylist')}>
                            {user?.publicPlaylists?.length} {t('Public Playlists')}
                        </span>
                        <span className={cx('total')}>
                            {user?.followers?.length} {t('Followers')}
                        </span>
                        <span className={cx('total')}>
                            {user?.followings?.length} {t('Following')}
                        </span>
                    </div>
                </div>
            </div>
            <div className={cx('actions')}>
                {user?._id !== userId && (
                    <div className={cx('action')}>
                        <FollowButton userId={id} />
                    </div>
                )}
                {user?._id === userId && (
                    <div className={cx('action')}>
                        <UserMenu />
                    </div>
                )}
            </div>
            <div className={cx('content')} />

            {user?.publicPlaylists?.length !== 0 && (
                <section className={cx('section-container')}>
                    <h1 className={cx('heading')}>{t('Public Playlists')}</h1>
                    <div className={cx('section-content')}>
                        <Grid container spacing={2}>
                            {user?.publicPlaylists?.map((item, index) => (
                                <Grid item xl={2} lg={3} md={4} xs={6} key={index}>
                                    <PlaylistItem playlist={item} to={`/playlist/${item._id}`} />
                                </Grid>
                            ))}
                        </Grid>
                    </div>
                </section>
            )}

            {user?.followers?.length !== 0 && (
                <section className={cx('section-container')}>
                    <h1 className={cx('heading')}>{t('Followers')}</h1>
                    <div className={cx('section-content')}>
                        <Grid container spacing={2}>
                            {user?.followers?.map((item, index) => (
                                <Grid item xl={2} lg={3} md={4} xs={6} key={index}>
                                    <UserItem
                                        name={item.name}
                                        image={item.image}
                                        type={item.type}
                                        to={`/${item.type}/${item._id}`}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </div>
                </section>
            )}

            {user?.followings?.length !== 0 && (
                <section className={cx('section-container')}>
                    <h1 className={cx('heading')}>{t('Following')}</h1>
                    <div className={cx('section-content')}>
                        <Grid container spacing={2}>
                            {user?.followings?.map((item, index) => (
                                <Grid item xl={2} lg={3} md={4} xs={6} key={index}>
                                    <UserItem
                                        name={item.name}
                                        image={item.image}
                                        type={item.type}
                                        to={`/${item.type}/${item._id}`}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </div>
                </section>
            )}
        </div>
    );
};

export default User;
