import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { DataGrid } from '@mui/x-data-grid';
import classNames from 'classnames/bind';
import { IconButton, Chip, Avatar } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import OnlinePredictionIcon from '@mui/icons-material/OnlinePrediction';
import AcUnitIcon from '@mui/icons-material/AcUnit';

import { useDebounce } from '~/hooks';
import axiosInstance from '~/api/axiosInstance';
import { getArtistsByContextUrl } from '~/api/urls/artistsUrl';
import ActionMenu from '~/components/admin/ActionsMenu';
import styles from './styles.scoped.scss';

const cx = classNames.bind(styles);

const ManageArtist = () => {
    const [searchUser, setSearchUser] = useState('');
    const [rows, setRows] = useState([]);
    const [update, setUpdate] = useState(false);

    const { t } = useTranslation();
    const debouncedValue = useDebounce(searchUser, 500);

    const searchUserInputRef = useRef();

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await axiosInstance(getArtistsByContextUrl + `?search=${searchUser}`);
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
            field: 'avatar',
            headerName: '*',
            width: 35,
            renderCell: (params) => (
                <Avatar alt={params.row.name} src={params.row.image} sx={{ width: 30, height: 30 }} />
            ),
        },
        {
            field: 'name',
            headerName: t('Name'),
            flex: 1,
        },
        { field: 'email', headerName: 'Email', flex: 1 },
        {
            field: 'totalTracks',
            headerName: t('Tracks'),
            flex: 1,
        },
        {
            field: 'totalAlbums',
            headerName: t('Albums'),
            flex: 1,
        },
        {
            field: 'totalFollowers',
            headerName: t('Followers'),
        },
        {
            field: 'status',
            headerName: t('Status'),
            flex: 1,
            renderCell: (params) => {
                if (params.row.status === 'actived')
                    return (
                        <Chip
                            color='success'
                            label='actived'
                            icon={<OnlinePredictionIcon />}
                            sx={{ fontSize: '1.4rem', backgroundColor: 'green', opacity: 0.7 }}
                        />
                    );
                else {
                    return (
                        <Chip
                            label='Freezed'
                            icon={<AcUnitIcon />}
                            sx={{
                                fontSize: '1.2rem',
                                backgroundColor: 'blue',
                                color: 'var(--secondary-color)',
                                opacity: 0.7,
                            }}
                        />
                    );
                }
            },
        },
        {
            field: 'actions',
            headerName: t('Actions'),
            flex: 1,
            sortable: false,
            renderCell: (params) => <ActionMenu handleUpdateData={handleUpdateData} type='user' row={params.row} />,
        },
    ];

    return (
        <div className={cx('container')}>
            <div className={cx('header')}>{t('Artists')}</div>
            <div className={cx('input-container')}>
                <IconButton>
                    <SearchIcon />
                </IconButton>
                <input
                    type='text'
                    placeholder={t('Search for artist, track and album')}
                    value={searchUser}
                    ref={searchUserInputRef}
                    onChange={() => setSearchUser(searchUserInputRef.current.value)}
                />
                <IconButton onClick={() => setSearchUser('')}>
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

export default ManageArtist;
