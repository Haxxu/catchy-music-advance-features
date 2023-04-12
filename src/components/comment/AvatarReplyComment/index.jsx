import React from 'react';
import classNames from 'classnames/bind';
import { Avatar } from '@mui/material';

import styles from './styles.module.scss';

const cx = classNames.bind(styles);

const AvatarReplyComment = ({ user, replyUser }) => {
    return (
        <div className={cx('container')}>
            <Avatar src={user.image} alt={user.name} sx={{ width: 50, height: 50 }} />
        </div>
    );
};

export default AvatarReplyComment;
