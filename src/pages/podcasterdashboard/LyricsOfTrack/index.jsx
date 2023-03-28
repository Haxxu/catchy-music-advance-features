import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import { useParams, Link } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { Button, IconButton } from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { confirmAlert } from 'react-confirm-alert';

import styles from './styles.scoped.scss';
import axiosInstance from '~/api/axiosInstance';
import { getAllLyricsOfTrackUrl, deleteLyricUrl } from '~/api/urls/lyricsUrl';
import { toast } from 'react-toastify';

const cx = classNames.bind(styles);

const LyricsOfTrack = () => {
    const [rows, setRows] = useState([]);
    const [update, setUpdate] = useState(false);
    const { id } = useParams();
    const { t } = useTranslation();

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await axiosInstance.get(getAllLyricsOfTrackUrl(id));
            setRows(data.data);
        };

        fetchData().catch(console.error);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [update]);

    const handleDeleteLyric = async (id) => {
        const { data } = await axiosInstance.delete(deleteLyricUrl(id));
        setUpdate((prev) => !prev);
        toast.success(data.message);
    };

    const columns = [
        {
            field: 'nation',
            headerName: t('Nation'),
            width: 100,
        },
        {
            field: 'track',
            headerName: t('Track'),
            width: 140,
            renderCell: (params) => <p>{params.row.track.name}</p>,
        },
        {
            field: 'content',
            headerName: t('Content'),
            flex: 1,
        },
        {
            field: 'actions',
            headerName: t('Actions'),
            width: 100,
            sortable: false,
            renderCell: (params) => (
                <div>
                    <Link to={params.row._id}>
                        <IconButton>
                            <EditIcon fontSize='large' />
                        </IconButton>
                    </Link>
                    <IconButton
                        className={cx('delete-btn')}
                        color='error'
                        onClick={() =>
                            confirmAlert({
                                title: t('Confirm to delete this lyric'),

                                message: t('Are you sure to do this.'),
                                buttons: [
                                    {
                                        label: t('Yes'),
                                        onClick: () => handleDeleteLyric(params.row._id),
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
                </div>
            ),
        },
    ];

    return (
        <div className={cx('container')}>
            <div className={cx('header')}>
                <h1>{t('My Lyrics')}</h1>
                <Link to='new-lyric'>
                    <Button
                        size='large'
                        color='secondary'
                        variant='contained'
                        startIcon={<AddIcon />}
                        sx={{
                            fontSize: '1.4rem',
                            fontWeight: '600',
                        }}
                    >
                        {t('Add new lyric')}
                    </Button>
                </Link>
            </div>
            <div className={cx('data-container')}>
                <DataGrid
                    autoHeight
                    columns={columns}
                    rows={rows}
                    getRowId={(row) => row._id}
                    pageSize={10}
                    sx={{ fontSize: '1.4rem', height: '100%', overflow: 'visible' }}
                    disableSelectionOnClick
                    getRowHeight={() => 'auto'}
                    rowsPerPageOptions={[10]}
                />
            </div>
        </div>
    );
};

export default LyricsOfTrack;
