import React from 'react';
import classNames from 'classnames/bind';

import Navbar from '~/components/Navbar';
import DashboardSidebar from '~/components/DashboardSidebar';
import { podcasterSidebarConfig } from '~/config/sidebarConfig';
import styles from './styles.scoped.scss';

const cx = classNames.bind(styles);

const PodcasterDashboardLayout = ({ children }) => {
    return (
        <div className={cx('container')}>
            <div className={cx('sidebar')}>
                <DashboardSidebar sidebarConfig={podcasterSidebarConfig} />
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

export default PodcasterDashboardLayout;
