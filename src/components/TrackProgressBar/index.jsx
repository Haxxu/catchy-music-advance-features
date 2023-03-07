import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames/bind';

import styles from './styles.scoped.scss';

const cx = classNames.bind(styles);

const TrackProgressBar = ({ percentage = 0, onChangeAudio }) => {
    const [position, setPosition] = useState(25);
    const [marginLeft, setMarginLeft] = useState(0);
    const [progressBarWidth, setProgressBarWidth] = useState(0);

    const rangeRef = useRef();
    const thumbRef = useRef();

    useEffect(() => {
        const rangeWidth = rangeRef.current.getBoundingClientRect().width;
        const thumbWidth = thumbRef.current.getBoundingClientRect().width;
        const centerThumb = (thumbWidth / 100) * percentage * -1;
        const centerProgressBar = thumbWidth + (rangeWidth / 100) * percentage - (thumbWidth / 100) * percentage;
        setPosition(percentage);
        setMarginLeft(centerThumb);
        setProgressBarWidth(centerProgressBar);
    }, [percentage]);

    return (
        <div className={cx('container')}>
            <div className={cx('progress-bar-cover')} style={{ width: `${progressBarWidth}px` }} />
            <div
                className='thumb'
                ref={thumbRef}
                style={{
                    left: `${position}%`,
                    marginLeft: `${marginLeft}px`,
                }}
            />
            <input type='range' step='0.01' className={cx('range')} ref={rangeRef} onChange={onChangeAudio} />
        </div>
    );
};

export default TrackProgressBar;
