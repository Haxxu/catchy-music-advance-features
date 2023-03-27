import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames/bind';
import { Avatar, ClickAwayListener } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import LogoutIcon from '@mui/icons-material/Logout';
import { toast } from 'react-toastify';
import { routes } from '~/config';
import HomeIcon from '@mui/icons-material/Home';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import SettingsIcon from '@mui/icons-material/Settings';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import DashboardCustomizeOutlinedIcon from '@mui/icons-material/DashboardCustomizeOutlined';

import DarkModeToggle from '~/components/DarkMode/DarkModeToggle';
// import { menuOptions } from './config';
import useAuth from '~/hooks/useAuth';
import { logout } from '~/redux/authSlice';
import axiosInstance from '~/api/axiosInstance';
import styles from './styles.module.scss';
import { getCurrentUserProfileUrl } from '~/api/urls/me';
import { useTranslation } from 'react-i18next';

const cx = classNames.bind(styles);

const Navbar = () => {
    const [profileMenu, setProfileMenu] = useState(false);
    const [user, setUser] = useState(null);

    const { type, userId } = useAuth();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { userProfileState } = useSelector((state) => state.updateState);
    const { t } = useTranslation();

    const menuOptions = [
        {
            title: t('Home'),
            path: routes.home,
            icon: <HomeIcon fontSize='large' />,
            roles: ['admin', 'artist', 'user', 'podcaster'],
        },
        {
            title: t('Profile'),
            path: routes.profile,
            icon: <AccountBoxIcon fontSize='large' />,
            roles: ['admin', 'artist', 'user', 'podcaster'],
        },
        {
            title: t('Dashboard'),
            path: routes.admin_dashboard,
            icon: <AdminPanelSettingsIcon fontSize='large' />,
            roles: ['admin'],
        },
        {
            title: t('Dashboard'),
            path: routes.artist_dashboard,
            icon: <DashboardCustomizeOutlinedIcon fontSize='large' />,
            roles: ['artist'],
        },
        {
            title: t('Dashboard'),
            path: routes.podcaster_dashboard,
            icon: <DashboardCustomizeOutlinedIcon fontSize='large' />,
            roles: ['podcaster'],
        },
        {
            title: t('Settings'),
            path: routes.settings,
            icon: <SettingsIcon fontSize='large' />,
            roles: ['admin', 'artist', 'user', 'podcaster'],
        },
    ];

    const toggleProfileMenu = () => {
        setProfileMenu((prev) => !prev);
    };

    const handleClickAwayProfileMenu = () => {
        setProfileMenu(false);
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
        toast.success('Logout successfully');
    };

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await axiosInstance.get(getCurrentUserProfileUrl);
            setUser(data.data);
            // console.log(data.data);
        };

        fetchData().catch(console.error);
    }, [userProfileState]);

    return (
        <div className={cx('container')}>
            <div className={cx('navigation')}>
                <div className={cx('icon', 'before')} onClick={() => navigate(-1)}>
                    <ArrowBackIosNewIcon />
                </div>
                <div className={cx('icon', 'next')} onClick={() => navigate(2)}>
                    <ArrowForwardIosIcon />
                </div>
            </div>
            <div className={cx('settings')}>
                <DarkModeToggle />
                <div className={cx('profile')}>
                    <div className={cx('avatar')} onClick={toggleProfileMenu}>
                        <Avatar
                            src={user?.image}
                            sizes='large'
                            sx={{
                                boxShadow: 3,
                            }}
                        />
                    </div>
                    {profileMenu && (
                        <ClickAwayListener onClickAway={handleClickAwayProfileMenu}>
                            <div className={cx('profile-menu')}>
                                <div className={cx('info')}>
                                    <p className={cx('name')}>{user?.name}</p>
                                    <p className={cx('email')}>{user?.email}</p>
                                </div>
                                <div className={cx('options')}>
                                    {menuOptions.map((option, index) => {
                                        if (option.roles.includes(type)) {
                                            return (
                                                <Link
                                                    to={
                                                        option.title !== 'Profile'
                                                            ? option.path
                                                            : `/${type === 'admin' ? 'user' : type}/${userId}`
                                                    }
                                                    className={cx('option')}
                                                    key={index}
                                                    onClick={() => toggleProfileMenu()}
                                                >
                                                    <span className={cx('icon')}>{option.icon}</span>{' '}
                                                    <span>{option.title}</span>
                                                </Link>
                                            );
                                        }
                                        return null;
                                    })}
                                </div>
                                <div className={cx('logout')}>
                                    <div className={cx('option')} onClick={handleLogout}>
                                        <span className={cx('icon')}>
                                            <LogoutIcon fontSize='large' />
                                        </span>{' '}
                                        {t('Logout')}
                                    </div>
                                </div>
                            </div>
                        </ClickAwayListener>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar;
