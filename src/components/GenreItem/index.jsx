import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import randomColor from 'randomcolor';

import styles from './styles.scoped.scss';
import { useSelector } from 'react-redux';

const cx = classNames.bind(styles);

const GenreItem = ({ genre }) => {
    const [color, setCololr] = useState('');
    const { theme } = useSelector((state) => state.userInterface);

    useEffect(() => {
        setCololr(randomColor({ luminosity: theme }));
    }, [genre, theme]);

    return (
        <Link to={`/genre/${genre._id}`} className={cx('container')} style={{ backgroundColor: color }}>
            <div className={'name'}>{genre.name}</div>
            <img className={cx('image')} src={genre.image} alt={genre.name} />
        </Link>
    );
};

export default GenreItem;
