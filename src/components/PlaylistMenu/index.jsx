import React, { useState } from 'react';
import classNames from 'classnames/bind';
import { useDispatch } from 'react-redux';
import { ClickAwayListener, Divider, IconButton, Paper, Popper, Modal, Typography, Box } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';

import styles from './styles.module.scss';
import axiosInstance from '~/api/axiosInstance';
import { addItemsToQueueUrl } from '~/api/urls/me';
import { updatePlaylistState, updatePlaylistInSidebarState } from '~/redux/updateStateSlice';
import { deletePlaylistUrl, togglePublicPlaylistUrl } from '~/api/urls/playlistsUrl';
import { useAuth } from '~/hooks';
import { routes } from '~/config';
import PlaylistForm from '../Forms/PlaylistForm';
import { useTranslation } from 'react-i18next';

const cx = classNames.bind(styles);

const PlaylistMenu = ({ tracks, playlistId, playlistOwnerId, isPublic }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [openPlaylistForm, setOpenPlaylistForm] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { userId } = useAuth();
    const { t } = useTranslation();

    const handleClick = (e) => {
        setAnchorEl(anchorEl ? null : e.currentTarget);
    };

    const handleClickAway = () => {
        setAnchorEl(null);
    };

    const addTrackToQueue = async () => {
        try {
            const { data } = await axiosInstance.post(addItemsToQueueUrl, {
                items: tracks?.map((item) => ({ context_uri: item.context_uri, position: item.position })),
            });
            toast.success(data.message);
            setAnchorEl(null);
        } catch (err) {
            console.log(err);
        }
    };

    const handleDeletePlaylist = async () => {
        try {
            const { data } = await axiosInstance.delete(deletePlaylistUrl(playlistId));
            dispatch(updatePlaylistInSidebarState());
            toast.success(data.message);
            navigate(routes.library_home);
        } catch (err) {
            console.log(err);
        }
    };

    const handleTogglePublicOfPlaylist = async () => {
        try {
            const res = await axiosInstance.put(togglePublicPlaylistUrl(playlistId));
            if (res.status === 200) {
                dispatch(updatePlaylistState());
                toast.success(res.data.message);
            } else {
                toast.error(res.data.message);
            }
            setAnchorEl(null);
        } catch (err) {
            console.log(err);
        }
    };

    const handleOpenPlaylistForm = async () => {
        setOpenPlaylistForm(true);
        // setAnchorEl(null);
    };

    return (
        <div className={cx('container')} onDoubleClick={(e) => e.stopPropagation()}>
            <IconButton onClick={handleClick} disableRipple sx={{ padding: 0 }}>
                <MoreHorizIcon sx={{ color: 'var(--text-primary)', width: '34px', height: '34px', padding: 0 }} />
            </IconButton>
            <Popper placement='bottom-start' open={Boolean(anchorEl)} anchorEl={anchorEl} sx={{ zIndex: 500 }}>
                <ClickAwayListener onClickAway={handleClickAway}>
                    <Paper className={cx('menu-container')}>
                        <div className={cx('menu-list')}>
                            <div className={cx('menu-item')} onClick={addTrackToQueue}>
                                {t('Add to queue')}
                            </div>
                            {playlistOwnerId === userId && (
                                <>
                                    <Divider />
                                    <div className={cx('menu-item')} onClick={handleOpenPlaylistForm}>
                                        {t('Edit detail')}
                                    </div>
                                    <div className={cx('menu-item')} onClick={handleTogglePublicOfPlaylist}>
                                        {isPublic ? t('Private this playlist') : t('Public this playlist')}
                                    </div>
                                    <Modal
                                        open={openPlaylistForm}
                                        onClose={() => setOpenPlaylistForm(false)}
                                        aria-labelledby='modal-playlist-detail-title'
                                        aria-describedby='modal-playlist-detail-description'
                                        sx={{
                                            zIndex: '501',
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                color: 'var(--text-primary)',
                                                position: 'absolute',
                                                top: '50%',
                                                left: '50%',
                                                transform: 'translate(-50%, -50%)',
                                                minWidth: 500,
                                                bgcolor: 'var(--background2-color)',
                                                border: '2px solid #000',
                                                boxShadow: 24,
                                                p: 4,
                                            }}
                                        >
                                            <Typography
                                                id='modal-playlist-detail-title'
                                                variant='h6'
                                                component='h2'
                                                sx={{ mt: 2, mb: 4, fontSize: '2rem' }}
                                            >
                                                {t('Playlist detail')}
                                            </Typography>
                                            <div
                                                id='modal-playlist-detail-description'
                                                style={{
                                                    mt: 2,
                                                    fontSize: '1.6rem',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    justifyContent: 'center',
                                                    maxWidth: '500px',
                                                    height: '500px',
                                                    overflow: 'hidden',
                                                    overflowY: 'scroll',
                                                    color: '#000',
                                                    borderRadius: '5px',
                                                }}
                                            >
                                                <PlaylistForm
                                                    customStyles={{
                                                        inputStyles: {
                                                            color: '#000',
                                                            border: '0.15rem solid #000',
                                                        },
                                                        textAreaStyles: {
                                                            color: '#000',
                                                            resize: 'vertical',
                                                            border: '0.15rem solid #000',
                                                        },
                                                        fileInputStyles: {
                                                            border: '0.15rem solid #000',
                                                        },
                                                    }}
                                                    handleClose={() => setAnchorEl(null)}
                                                />
                                            </div>
                                        </Box>
                                    </Modal>
                                    <Divider />
                                    <div
                                        className={cx('menu-item')}
                                        onClick={() => {
                                            setAnchorEl(null);
                                            confirmAlert({
                                                title: t('Confirm to delete this playlist'),

                                                message: t('Are you sure to do this.'),
                                                buttons: [
                                                    {
                                                        label: t('Yes'),
                                                        onClick: () => handleDeletePlaylist(),
                                                    },
                                                    {
                                                        label: t('No'),
                                                    },
                                                ],
                                            });
                                        }}
                                    >
                                        {t('Delete this playlist')}
                                    </div>
                                </>
                            )}
                        </div>
                    </Paper>
                </ClickAwayListener>
            </Popper>
        </div>
    );
};

export default PlaylistMenu;
