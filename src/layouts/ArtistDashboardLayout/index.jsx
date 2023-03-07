import React from 'react';
import classNames from 'classnames/bind';

import Navbar from '~/components/Navbar';
import DashboardSidebar from '~/components/DashboardSidebar';
import { artistSidebarConfig } from '~/config/sidebarConfig';
import styles from './styles.scoped.scss';

const cx = classNames.bind(styles);

const ArtistDashboardLayout = ({ children }) => {
    return (
        <div className={cx('container')}>
            <div className={cx('sidebar')}>
                <DashboardSidebar sidebarConfig={artistSidebarConfig} />
            </div>
            <div className={cx('main')}>
                <div className={cx('navbar')}>
                    <Navbar />
                </div>
                <div className={cx('main-content')}>{children}</div>
            </div>
        </div>
    );
};

export default ArtistDashboardLayout;
