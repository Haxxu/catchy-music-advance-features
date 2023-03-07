import { useState } from 'react';
import { Button, Box, Typography, Modal } from '@mui/material';
import { confirmAlert } from 'react-confirm-alert';
import classnames from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import 'react-confirm-alert/src/react-confirm-alert.css';

import ManageTrackTable from '~/components/admin/Table/ManageTrackTable';
import Detail from '~/components/admin/Detail';
import styles from './styles.scoped.scss';
import axiosInstance from '~/api/axiosInstance';
import { togglePublicPlaylistUrl, deletePlaylistUrl } from '~/api/urls/playlistsUrl';
import { toast } from 'react-toastify';

const cx = classnames.bind(styles);

const PlaylistActionsMenu = ({ handleUpdateData, row }) => {
    const [openDetailModal, setOpenDetailModal] = useState(false);
    const [openTracksModal, setOpenTracksModal] = useState(false);

    const { t } = useTranslation();

    const handleTogglePublic = async () => {
        const { data } = await axiosInstance.put(togglePublicPlaylistUrl(row._id), {});

        handleUpdateData();
        toast.success(data.message);
    };

    const handleDeletePlaylist = async () => {
        const { data } = await axiosInstance.delete(deletePlaylistUrl(row._id));

        handleUpdateData();
        toast.success(data.message);
    };

    return (
        <div className={cx('menu')}>
            <Button
                variant='contained'
                color='secondary'
                sx={{ minWidth: '100px' }}
                onClick={() => setOpenDetailModal(true)}
            >
                {t('Detail')}
            </Button>
            <Button
                variant='contained'
                color='success'
                sx={{ minWidth: '100px' }}
                onClick={() => setOpenTracksModal(true)}
            >
                {t('Tracks')}
            </Button>
            <Button
                variant='contained'
                sx={{ minWidth: '100px' }}
                onClick={() =>
                    confirmAlert({
                        title: t('Confirm to toggle public'),

                        message: t('Are you sure to do this.'),
                        buttons: [
                            {
                                label: t('Yes'),
                                onClick: handleTogglePublic,
                            },
                            {
                                label: t('No'),
                            },
                        ],
                    })
                }
            >
                {row.isPublic ? t('Private') : t('Public')}
            </Button>
            <Button
                variant='contained'
                color='error'
                sx={{ minWidth: '100px' }}
                onClick={() =>
                    confirmAlert({
                        title: t('Confirm to delete this playlist'),

                        message: t('Are you sure to do this.'),
                        buttons: [
                            {
                                label: t('Yes'),
                                onClick: handleDeletePlaylist,
                            },
                            {
                                label: t('No'),
                            },
                        ],
                    })
                }
            >
                {t('Delete')}
            </Button>
            <Modal
                open={openDetailModal}
                onClose={() => setOpenDetailModal(false)}
                aria-labelledby='modal-album-detail-title'
                aria-describedby='modal-album-detail-description'
                sx={{
                    zIndex: '30',
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
                        id='modal-album-detail-title'
                        variant='h6'
                        component='h2'
                        sx={{ mt: 2, mb: 4, fontSize: '2rem' }}
                    >
                        {t('Playlist detail')}
                    </Typography>
                    <div
                        id='modal-album-detail-description'
                        style={{
                            mt: 2,
                            fontSize: '1.6rem',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                        }}
                    >
                        <Detail data={row} />
                    </div>
                </Box>
            </Modal>
            <Modal
                open={openTracksModal}
                onClose={() => setOpenTracksModal(false)}
                aria-labelledby='modal-tracks-title'
                aria-describedby='modal-tracks-description'
            >
                <Box
                    sx={{
                        color: 'var(--text-primary)',
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        minWidth: '70%',
                        minHeight: '70%',
                        bgcolor: 'var(--background2-color)',
                        border: '2px solid #000',
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <Typography
                        id='modal-tracks-title'
                        variant='h6'
                        component='h2'
                        sx={{ mt: 2, mb: 4, fontSize: '2rem' }}
                    >
                        {t('Tracks')}
                    </Typography>
                    <div
                        id='modal-tracks-description'
                        style={{
                            width: '100%',
                        }}
                    >
                        <ManageTrackTable type='playlist' id={row._id} handleUpdateData={handleUpdateData} />
                    </div>
                </Box>
            </Modal>
        </div>
    );
};

export default PlaylistActionsMenu;
