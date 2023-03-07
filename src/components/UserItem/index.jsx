import React from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import { Avatar } from '@mui/material';

import styles from './styles.scoped.scss';

const cx = classNames.bind(styles);

const UserItem = ({ type = 'User', name, image, to }) => {
    // const [activePlayBtn, setActivePlayBtn] = useState(false);

    return (
        <div
            className={cx('container')}
            // onMouseEnter={() => setActivePlayBtn(true)}
            // onMouseLeave={() => setActivePlayBtn(false)}
        >
            <Link className={cx('user-img-link')} to={to}>
                <Avatar
                    className={cx('image')}
                    variant='circular'
                    src={image}
                    alt={name}
                    sx={{ width: '160px', height: '160px' }}
                />
            </Link>
            <div className={cx('info')}>
                <Link className={cx('user-link')} to={to}>
                    <p className={cx('name')}>{name}</p>
                </Link>
                <div className={cx('detail')}>
                    <div className={cx('description')}>{type}</div>
                </div>
            </div>
        </div>
    );
};

export default UserItem;
