import React from 'react';
import RedoIcon from '@mui/icons-material/Redo';
import classNames from 'classnames/bind';

import styles from './styles.module.scss';

const cx = classNames.bind(styles);

const SkipForwardCustomIcon = ({ number = 15, classNamesCus }) => {
    return (
        <span className={cx('container')}>
            <RedoIcon className={classNamesCus} />
            <span className={cx('number')}>{number}</span>
        </span>
    );
};

export default SkipForwardCustomIcon;
