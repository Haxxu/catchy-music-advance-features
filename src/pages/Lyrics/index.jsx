import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import { useSelector } from 'react-redux';

import styles from './styles.scoped.scss';
import { getLyricsOfTrack } from '~/api/urls/tracksUrls';
import axiosInstance from '~/api/axiosInstance';
import { useTranslation } from 'react-i18next';

const cx = classNames.bind(styles);

const Lyrics = () => {
    const { context } = useSelector((state) => state.audioPlayer);
    const [lyrics, setLyrics] = useState([]);
    const { t } = useTranslation();

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await axiosInstance.get(getLyricsOfTrack(context.trackId));
            setLyrics(data.data);
        };

        fetchData().catch(console.error);
    }, [context]);

    return (
        <div className={cx('container')}>
            <div className={cx('heading')}>{t('Lyrics')}</div>
            {lyrics.length !== 0 ? (
                <div className={cx('lyrics')}>
                    {lyrics[0]?.content?.split('\n').map((item, index) => (
                        <h5 className={cx('sentence')} key={index}>
                            {item}
                        </h5>
                    ))}
                </div>
            ) : (
                <div className={cx('notification')}>{t('Song not update lyrics yet')}</div>
            )}
        </div>
    );
};

export default Lyrics;
