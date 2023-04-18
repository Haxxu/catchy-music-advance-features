import React, { useState, useRef, useEffect } from 'react';
// import { Link } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import classNames from 'classnames/bind';
import { IconButton, Avatar } from '@mui/material';
// import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
// import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';
import Moment from 'moment';
import { confirmAlert } from 'react-confirm-alert';
import { toast } from 'react-toastify';

import styles from './styles.scoped.scss';
// import { routes } from '~/config';
import { useAuth, useDebounce } from '~/hooks';
import axiosInstance from '~/api/axiosInstance';
import { deletePostByIdUrl, getPostsByTagsUrl } from '~/api/urls/postUrl';

const cx = classNames.bind(styles);

const ManagePosts = () => {
    const [searchPost, setSearchPost] = useState('');
    const [rows, setRows] = useState([]);
    const [update, setUpdate] = useState(false);

    const searchPostInputRef = useRef();
    const debouncedValue = useDebounce(searchPost, 650);
    const { userId } = useAuth();
    const { t } = useTranslation();

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await axiosInstance.get(getPostsByTagsUrl(), {
                params: { search: searchPost },
            });
            setRows(data.data.posts);
            // console.log(data.data.posts);
        };

        fetchData().catch(console.error);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedValue, userId, update]);

    const handleDeletePost = async (id) => {
        try {
            const { data } = await axiosInstance.delete(deletePostByIdUrl(id));
            setUpdate((prev) => !prev);
            toast.success(data.message);
        } catch (error) {
            console.log(error);
        }
    };

    const columns = [
        {
            field: 'owner',
            headerName: 'User',

            valueGetter: (params) => params.row.owner.name,
        },
        {
            field: 'email',
            headerName: 'Email',
            flex: 1,
            valueGetter: (params) => params.row.owner.email,
        },
        {
            field: 'image',
            headerName: t('Image'),
            flex: 1,
            renderCell: (params) => (
                <Avatar
                    alt={params.row.name}
                    src={params.row.image}
                    sx={{ width: '100%', height: '100%' }}
                    variant='square'
                />
                // <img alt={params.row.name} src={params.row.image} style={{ objectFit: 'cover', width: '200px' }} />
            ),
        },
        {
            field: 'title',
            headerName: t('Title'),
            flex: 1,
            valueGetter: (params) => params.row.title,
        },
        {
            field: 'description',
            headerName: t('Description'),
            flex: 1,
            valueGetter: (params) => params.row.description,
        },

        {
            field: 'likes',
            headerName: t('Likes'),
            // flex: 1,
            valueGetter: (params) => params.row.likes.length,
        },
        {
            field: 'createdAt',
            headerName: t('Created At'),
            // flex: 1,
            valueGetter: (params) => Moment(params.row.createdAt).format('DD-MM-YYYY'),
        },
        {
            field: 'actions',
            headerName: t('Actions'),
            width: 200,
            // flex: 1,
            sortable: false,
            renderCell: (params) => (
                <div>
                    {/* <Link to={routes.managePosts_posts + `/${params.row._id}`}>
                        <IconButton>
                            <EditIcon fontSize='large' />
                        </IconButton>
                    </Link> */}

                    <IconButton
                        className={cx('delete-btn')}
                        color='error'
                        onClick={() =>
                            confirmAlert({
                                title: t('Confirm to delete this post'),

                                message: t('Are you sure to do this.'),
                                buttons: [
                                    {
                                        label: t('Yes'),
                                        onClick: () => handleDeletePost(params.row._id),
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
                <h1>{t('Posts')}</h1>
            </div>
            <div className={cx('input-container')}>
                <IconButton>
                    <SearchIcon />
                </IconButton>
                <input
                    type='text'
                    placeholder={t('Search for user, user email, post')}
                    value={searchPost}
                    ref={searchPostInputRef}
                    onChange={() => setSearchPost(searchPostInputRef.current.value)}
                />
                <IconButton onClick={() => setSearchPost('')}>
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

export default ManagePosts;
