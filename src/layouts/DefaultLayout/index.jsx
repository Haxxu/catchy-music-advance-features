import React from 'react';
import classNames from 'classnames/bind';
import routes from '~/config/routes';

import Footer from '~/components/Footer';
import styles from './styles.scoped.scss';
import DarkModeToggle from '~/components/DarkMode/DarkModeToggle';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);

const DefaultLayout = ({ children }) => {
    return (
        <div className={cx('container')}>
            <div className={'header'}>
                <Link to={routes.home} className='brand'>
                    CATCHY MUSIC
                </Link>
                <DarkModeToggle className='button' size='large' variant='contained' />
            </div>
            {children}
            <Footer />
        </div>
    );
};

export default DefaultLayout;
