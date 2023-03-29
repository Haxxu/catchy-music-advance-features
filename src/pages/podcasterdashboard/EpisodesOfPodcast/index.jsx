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
import { getPodcasterEpisodesUrl } from '~/api/urls/podcastersUrl';
import { fancyTimeFormat } from '~/utils/Format';
import styles from './styles.scoped.scss';
import { getPodcastByIdUrl, addEpisodeToPodcastUrl, removeEpisodeFromPodcastUrl } from '~/api/urls/podcastsUrl';

const cx = classNames.bind(styles);

const EpisodesOfPodcast = () => {
    const [searchTrack, setSearchTrack] = useState('');
    const [rows, setRows] = useState([]);
    const [tracks, setTracks] = useState([]);
    const [update, setUpdate] = useState(false);

    const searchTrackInputRef = useRef();
    const debouncedValue = useDebounce(searchTrack, 500);
    const { id: podcastId } = useParams();
    const { userId } = useAuth();
    const { t } = useTranslation();

    const handleAddEpisodeToPodcast = async (podcastId, trackId) => {
        const { data } = await axiosInstance.post(addEpisodeToPodcastUrl(podcastId), { track: trackId });
        setUpdate((prev) => !prev);
        toast.success(data.message);
    };

    const handleRemoveEpisodeFromPodcast = async (podcastId, trackId) => {
        const { data } = await axiosInstance.delete(removeEpisodeFromPodcastUrl(podcastId), {
            data: { track: trackId },
        });
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
            headerName: t('Podcasters'),
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
            field: 'alreadyInPodcast',
            headerName: t('Already in podcast'),
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
                                        title: t('Confirm to remove this episode from podcast'),

                                        message: t('Are you sure to do this.'),
                                        buttons: [
                                            {
                                                label: t('Yes'),
                                                onClick: () =>
                                                    handleRemoveEpisodeFromPodcast(podcastId, params.row._id),
                                            },
                                            {
                                                label: t('No'),
                                            },
                                        ],
                                    })
                                }
                            >
                                {t('Remove episode')}
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
                                        title: t('Confirm to add this episode to podcast'),
                                        message: t('Are you sure to do this.'),
                                        buttons: [
                                            {
                                                label: t('Yes'),
                                                onClick: () => handleAddEpisodeToPodcast(podcastId, params.row._id),
                                            },
                                            {
                                                label: t('No'),
                                            },
                                        ],
                                    })
                                }
                            >
                                {t('Add episode')}
                            </Button>
                        </div>
                    );
                }
            },
        },
    ];

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await axiosInstance.get(getPodcasterEpisodesUrl(userId), {
                params: { search: searchTrack },
            });
            const { data: podcast } = await axiosInstance.get(getPodcastByIdUrl(podcastId));
            console.log(data.data);
            setRows(data.data);
            setTracks(podcast.data.episodes);
        };

        fetchData().catch(console.error);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedValue, update]);

    return (
        <div className={cx('container')}>
            <div className={cx('header')}>
                <h1>{t('My Episodes')}</h1>
            </div>
            <div className={cx('input-container')}>
                <IconButton>
                    <SearchIcon />
                </IconButton>
                <input
                    type='text'
                    placeholder={t('Search for my episode')}
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

export default EpisodesOfPodcast;
