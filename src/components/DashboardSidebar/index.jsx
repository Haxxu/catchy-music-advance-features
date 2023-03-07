import classNames from 'classnames/bind';
import React from 'react';
import { NavLink } from 'react-router-dom';

import styles from './styles.scoped.scss';
// import sidebarConfig from './config';

const cx = classNames.bind(styles);

const DashboardSidebar = ({ sidebarConfig }) => {
    return (
        <div className={cx('container')}>
            <div className={cx('brand')}>
                <h3>CATCHY MUSIC</h3>
            </div>
            <div className={cx('list')}>
                {sidebarConfig.map((item, index) => (
                    <NavLink
                        key={index}
                        to={item.path}
                        className={({ isActive }) => cx('list-item', { active: isActive })}
                    >
                        <span className={cx('icon')}>{item.icon}</span>
                        {item.title}
                    </NavLink>
                ))}
            </div>
        </div>
    );
};

export default DashboardSidebar;
