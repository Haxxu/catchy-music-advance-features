import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import { useParams } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Avatar } from '@mui/material';
import { CheckCircle as CheckCircleIcon, HighlightOff as HighlightOffIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { confirmAlert } from 'react-confirm-alert';
import { toast } from 'react-toastify';

import styles from './styles.scoped.scss';
import axiosInstance from '~/api/axiosInstance';
import { getArtistAlbumsUrl } from '~/api/urls/artistsUrl';
import { addTrackToAlbumUrl, removeTrackFromAlbumUrl } from '~/api/urls/albumsUrl';
import { useAuth } from '~/hooks';

const cx = classNames.bind(styles);

const AlbumsOfTrack = () => {
    const [rows, setRows] = useState([]);
    const [update, setUpdate] = useState(false);
    const { id: trackId } = useParams();
    const { userId } = useAuth();
    const { t } = useTranslation();

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await axiosInstance.get(getArtistAlbumsUrl(userId), {
                params: { context: 'detail' },
            });
            setRows(data.data);
        };

        fetchData().catch(console.error);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [update]);

    const handleAddTrackToAlbum = async (albumId, trackId) => {
        const { data } = await axiosInstance.post(addTrackToAlbumUrl(albumId), { track: trackId });
        setUpdate((prev) => !prev);
        toast.success(data.message);
    };

    const handleRemoveTrackFromAlbum = async (albumId, trackId) => {
        const { data } = await axiosInstance.delete(removeTrackFromAlbumUrl(albumId), { data: { track: trackId } });
        setUpdate((prev) => !prev);
        toast.success(data.message);
    };

    const columns = [
        {
            field: 'image',
            headerName: t('Image'),
            width: 35,
            renderCell: (params) => (
                <Avatar alt={params.row.name} src={params.row.image} sx={{ width: 30, height: 30 }} variant='square' />
            ),
        },
        {
            field: 'name',
            headerName: t('Name'),
            flex: 1,
        },
        {
            field: 'isReleased',
            headerName: t('Is Released'),
            flex: 1,
            renderCell: (params) => {
                if (params.row.isReleased) {
                    return <CheckCircleIcon color='success' fontSize='large' />;
                } else {
                    return <HighlightOffIcon color='error' fontSize='large' />;
                }
            },
        },
        {
            field: 'tracks',
            headerName: t('Tracks'),
            flex: 1,
            valueGetter: (params) => params.row.tracks.length,
        },
        {
            field: 'alreayhavetrack',
            headerName: t('Already have track'),
            flex: 1,
            renderCell: (params) => {
                let flag = params.row.tracks.find((item) => item.track === trackId);
                if (flag) {
                    return <CheckCircleIcon color='success' fontSize='large' />;
                } else {
                    return <HighlightOffIcon color='error' fontSize='large' />;
                }
            },
        },
        {
            field: 'actions',
            headerName: t('Actions'),
            width: 100,
            sortable: false,
            renderCell: (params) => {
                let flag = params.row.tracks.find((item) => item.track === trackId);
                if (flag) {
                    return (
                        <div style={{ padding: '10px' }}>
                            <Button
                                color='error'
                                variant='contained'
                                onClick={() =>
                                    confirmAlert({
                                        title: t('Confirm to remove track from this album'),

                                        message: t('Are you sure to do this.'),
                                        buttons: [
                                            {
                                                label: t('Yes'),
                                                onClick: () => handleRemoveTrackFromAlbum(params.row._id, trackId),
                                            },
                                            {
                                                label: t('No'),
                                            },
                                        ],
                                    })
                                }
                            >
                                {t('Remove track')}
                            </Button>
                        </div>
                    );
                } else {
                    return (
                        <div style={{ padding: '10px' }}>
                            <Button
                                color='secondary'
                                variant='contained'
                                onClick={() =>
                                    confirmAlert({
                                        title: t('Confirm to add track to this album'),

                                        message: t('Are you sure to do this.'),
                                        buttons: [
                                            {
                                                label: t('Yes'),
                                                onClick: () => handleAddTrackToAlbum(params.row._id, trackId),
                                            },
                                            {
                                                label: t('No'),
                                            },
                                        ],
                                    })
                                }
                            >
                                {t('Add track')}
                            </Button>
                        </div>
                    );
                }
            },
        },
    ];

    return (
        <div className={cx('container')}>
            <div className={cx('header')}>
                <h1>{t('My Albums')}</h1>
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

export default AlbumsOfTrack;
