import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames/bind';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeMuteIcon from '@mui/icons-material/VolumeMute';
import VolumeDownIcon from '@mui/icons-material/VolumeDown';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';

import styles from './styles.scoped.scss';
import { IconButton } from '@mui/material';

const cx = classNames.bind(styles);

const VolumeControl = ({ volume, onChangeVolume }) => {
    const [position, setPosition] = useState(50);
    const [marginLeft, setMarginLeft] = useState(0);
    const [progressBarWidth, setProgressBarWidth] = useState(0);

    const rangeRef = useRef();
    const thumbRef = useRef();

    useEffect(() => {
        const rangeWidth = rangeRef.current.getBoundingClientRect().width;
        const thumbWidth = thumbRef.current.getBoundingClientRect().width;
        const centerThumb = (thumbWidth / 100) * volume * -1;
        const centerProgressBar = thumbWidth + (rangeWidth / 100) * volume - (thumbWidth / 100) * volume;
        setPosition(volume);
        setMarginLeft(centerThumb);
        setProgressBarWidth(centerProgressBar);
    }, [volume]);

    return (
        <div className={cx('container')}>
            <IconButton className={cx('button')} disableRipple>
                {volume === 0 && <VolumeOffIcon className={cx('icon')} />}
                {volume > 0 && volume <= 10 && <VolumeMuteIcon className={cx('icon')} />}
                {volume > 10 && volume <= 50 && <VolumeDownIcon className={cx('icon')} />}
                {volume > 50 && volume <= 100 && <VolumeUpIcon className={cx('icon')} />}
            </IconButton>
            <div className={cx('input-container')}>
                <div className={cx('progress-bar-cover')} style={{ width: `${progressBarWidth}px` }} />
                <div
                    className='thumb'
                    ref={thumbRef}
                    style={{
                        left: `${position}%`,
                        marginLeft: `${marginLeft}px`,
                    }}
                />
                <input
                    type='range'
                    step='1'
                    className={cx('range')}
                    ref={rangeRef}
                    min={0}
                    max={100}
                    onChange={onChangeVolume}
                />
            </div>
        </div>
    );
};

export default VolumeControl;
