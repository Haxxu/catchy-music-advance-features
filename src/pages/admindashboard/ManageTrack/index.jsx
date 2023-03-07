import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { DataGrid } from '@mui/x-data-grid';
import classNames from 'classnames/bind';
import Moment from 'moment';
import { IconButton, Avatar } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

import { useDebounce } from '~/hooks';
import axiosInstance from '~/api/axiosInstance';
import { getTracksByContextUrl } from '~/api/urls/tracksUrls';
import { fancyTimeFormat } from '~/utils/Format';
import ActionMenu from '~/components/admin/ActionsMenu';
import styles from './styles.scoped.scss';

const cx = classNames.bind(styles);

const ManageTrack = () => {
    const [searchTrack, setSearchTrack] = useState('');
    const [rows, setRows] = useState([]);
    const [update, setUpdate] = useState(false);

    const { t } = useTranslation();
    const debouncedValue = useDebounce(searchTrack, 500);
    const searchTrackInputRef = useRef();

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await axiosInstance(getTracksByContextUrl + `?search=${searchTrack}`);
            setRows(data.data);
        };

        fetchData().catch(console.error);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedValue, update]);

    const handleUpdateData = () => {
        setUpdate(!update);
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
            headerName: t('Artist'),
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
            field: 'plays',
            headerName: t('Plays'),
            flex: 1,
        },
        {
            field: 'saved',
            headerName: t('Saved'),
        },
        {
            field: 'createdAt',
            headerName: t('Created At'),
            flex: 1,
            valueGetter: (params) => Moment(params.row.createdAt).format('DD-MM-YYYY'),
        },
        {
            field: 'actions',
            headerName: t('Actions'),
            flex: 1,
            sortable: false,
            renderCell: (params) => <ActionMenu handleUpdateData={handleUpdateData} type='track' row={params.row} />,
        },
    ];

    return (
        <div className={cx('container')}>
            <div className={cx('header')}>{t('Tracks')}</div>
            <div className={cx('input-container')}>
                <IconButton>
                    <SearchIcon />
                </IconButton>
                <input
                    type='text'
                    placeholder={t('Search for track, artist')}
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

export default ManageTrack;
