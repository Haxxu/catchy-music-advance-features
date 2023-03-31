import React from 'react';
import UndoIcon from '@mui/icons-material/Undo';
import classNames from 'classnames/bind';

import styles from './styles.module.scss';

const cx = classNames.bind(styles);

const SkipBackwardCustomIcon = ({ number = 15, classNamesCus }) => {
    return (
        <span className={cx('container')}>
            <UndoIcon className={classNamesCus} />
            <span className={cx('number')}>{number}</span>
        </span>
    );
};

export default SkipBackwardCustomIcon;
