import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import { Grid } from '@mui/material';

import GenreItem from '~/components/GenreItem';
import styles from './styles.scoped.scss';
import axiosInstance from '~/api/axiosInstance';
import { getGenresUrl } from '~/api/urls/genresUrl';

const cx = classNames.bind(styles);

const GenreList = () => {
    const [genres, setGenres] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await axiosInstance.get(getGenresUrl);
            setGenres(data.data);
            // console.log(data.data);
        };

        fetchData().catch(console.error);
    }, []);

    return (
        <div className={cx('container')}>
            <Grid container spacing={1}>
                {genres.map((genre, index) => (
                    <Grid item xl={2} lg={3} md={4} xs={6} key={index}>
                        <GenreItem genre={genre} />
                    </Grid>
                ))}
            </Grid>
        </div>
    );
};

export default GenreList;
