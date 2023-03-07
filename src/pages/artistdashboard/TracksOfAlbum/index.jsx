import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import { DataGrid } from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';
import { IconButton, Avatar, Button } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import Moment from 'moment';
import { confirmAlert } from 'react-confirm-alert';
import { toast } from 'react-toastify';

import { useAuth, useDebounce } from '~/hooks';
import axiosInstance from '~/api/axiosInstance';
import { getArtistTracksUrl } from '~/api/urls/artistsUrl';
import { fancyTimeFormat } from '~/utils/Format';
import styles from './styles.scoped.scss';
import { getAlbumByIdUrl, addTrackToAlbumUrl, removeTrackFromAlbumUrl } from '~/api/urls/albumsUrl';

const cx = classNames.bind(styles);

const TracksOfAlbums = () => {
    const [searchTrack, setSearchTrack] = useState('');
    const [rows, setRows] = useState([]);
    const [tracks, setTracks] = useState([]);
    const [update, setUpdate] = useState(false);

    const searchTrackInputRef = useRef();
    const debouncedValue = useDebounce(searchTrack, 500);
    const { id: albumId } = useParams();
    const { userId } = useAuth();
    const { t } = useTranslation();

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
            field: 'artists',
            headerName: t('Artists'),
            flex: 1,
            renderCell: (params) => {
                return (
                    <div>
                        {params.row.artists.map((artist, index) => (
                            <p key={index}>{artist.name}</p>
                        ))}
                    </div>
                );
            },
        },
        {
            field: 'duration',
            headerName: t('Duration'),
            flex: 1,
            valueGetter: (params) => fancyTimeFormat(params.row.duration),
        },
        {
            field: 'createdAt',
            headerName: t('Created At'),
            flex: 1,
            valueGetter: (params) => Moment(params.row.createdAt).format('DD-MM-YYYY'),
        },
        {
            field: 'alreadyInAlbum',
            headerName: t('Already in album'),
            flex: 1,
            renderCell: (params) => {
                let flag = tracks.find((item) => item.track._id === params.row._id);
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
            flex: 1,
            sortable: false,
            renderCell: (params) => {
                let flag = tracks.find((item) => item.track._id === params.row._id);
                if (flag) {
                    return (
                        <div style={{ padding: '10px' }}>
                            <Button
                                color='error'
                                variant='contained'
                                onClick={() =>
                                    confirmAlert({
                                        title: t('Confirm to remove this track from album'),

                                        message: t('Are you sure to do this.'),
                                        buttons: [
                                            {
                                                label: t('Yes'),
                                                onClick: () => handleRemoveTrackFromAlbum(albumId, params.row._id),
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
                                        title: t('Confirm to add this track to album'),
                                        message: t('Are you sure to do this.'),
                                        buttons: [
                                            {
                                                label: t('Yes'),
                                                onClick: () => handleAddTrackToAlbum(albumId, params.row._id),
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

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await axiosInstance.get(getArtistTracksUrl(userId), {
                params: { search: searchTrack },
            });
            const { data: album } = await axiosInstance.get(getAlbumByIdUrl(albumId));

            setRows(data.data);
            setTracks(album.data.tracks);
        };

        fetchData().catch(console.error);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedValue, update]);

    return (
        <div className={cx('container')}>
            <div className={cx('header')}>
                <h1>{t('My Tracks')}</h1>
            </div>
            <div className={cx('input-container')}>
                <IconButton>
                    <SearchIcon />
                </IconButton>
                <input
                    type='text'
                    placeholder={t('Search for my track')}
                    value={searchTrack}
                    ref={searchTrackInputRef}
                    onChange={() => setSearchTrack(searchTrackInputRef.current.value)}
                />
                <IconButton onClick={() => setSearchTrack('')}>
                    <ClearIcon />
                </IconButton>
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

export default TracksOfAlbums;
