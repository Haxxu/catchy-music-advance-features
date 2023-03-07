import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import {
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableCell,
    TableRow,
    Paper,
    IconButton,
    CircularProgress,
    Avatar,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';
import { useTranslation } from 'react-i18next';

import { dateFormat } from '~/utils/Format';
import { getGenresUrl, deleteGenreUrl } from '~/api/urls/genresUrl';
import axiosInstance from '~/api/axiosInstance';
import { routes } from '~/config';
import styles from './styles.scoped.scss';

const cx = classNames.bind(styles);

const ManageGenreTable = () => {
    const [loading, setLoading] = useState();
    const [genres, setGenres] = useState([]);
    const [update, setUpdate] = useState(false);

    const { t } = useTranslation();

    const handleDeleteGenre = async (id) => {
        const { data } = await axiosInstance.delete(deleteGenreUrl(id));
        setUpdate((prev) => !prev);
        toast.success(data.message);
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const { data } = await axiosInstance(getGenresUrl);

            setGenres(data.data);

            setLoading(false);
        };

        fetchData().catch(console.error);
    }, [update]);

    return (
        <TableContainer component={Paper} className={cx('table-container')}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell align='center'>{t('Image')}</TableCell>
                        <TableCell align='center'>{t('Name')}</TableCell>
                        <TableCell align='center'>{t('Description')}</TableCell>
                        <TableCell align='center'>{t('Created At')}</TableCell>
                        <TableCell align='center'>{t('Actions')}</TableCell>
                    </TableRow>
                </TableHead>
                {loading ? (
                    <TableBody>
                        <TableRow>
                            <TableCell align='center' />
                            <TableCell align='center' />
                            <TableCell align='center'>
                                <CircularProgress color='primary' size='large' />
                            </TableCell>
                            <TableCell align='center' />
                            <TableCell align='center' />
                        </TableRow>
                    </TableBody>
                ) : (
                    <TableBody>
                        {genres.length !== 0 &&
                            genres.map((genre) => (
                                <TableRow key={genre._id}>
                                    <TableCell align='center' sx={{ justifyContent: 'center', display: 'flex' }}>
                                        <Avatar variant='square' src={genre.image} alt={genre.name} />
                                    </TableCell>
                                    <TableCell align='center'>{genre.name}</TableCell>
                                    <TableCell align='center'>{genre.description}</TableCell>
                                    <TableCell align='center'>{dateFormat(genre.createdAt)}</TableCell>
                                    <TableCell align='center'>
                                        <Link to={routes.admin_manageGenre + `/${genre._id}`}>
                                            <IconButton>
                                                <EditIcon fontSize='large' />
                                            </IconButton>
                                        </Link>
                                        <IconButton
                                            className={cx('delete-btn')}
                                            color='error'
                                            onClick={() =>
                                                confirmAlert({
                                                    title: t('Confirm to delete this genre'),

                                                    message: t('Are you sure to do this.'),
                                                    buttons: [
                                                        {
                                                            label: t('Yes'),
                                                            onClick: () => handleDeleteGenre(genre._id),
                                                        },
                                                        {
                                                            label: t('No'),
                                                        },
                                                    ],
                                                })
                                            }
                                        >
                                            <DeleteIcon fontSize='large' />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        {genres.length === 0 && (
                            <TableRow>
                                <TableCell align='center' />
                                <TableCell align='center' />
                                <TableCell align='center'>{t('No data')}</TableCell>
                                <TableCell align='center' />
                                <TableCell align='center' />
                            </TableRow>
                        )}
                    </TableBody>
                )}
            </Table>
        </TableContainer>
    );
};

export default ManageGenreTable;
