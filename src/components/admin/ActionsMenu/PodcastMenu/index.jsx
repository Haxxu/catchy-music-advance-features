import { useState } from 'react';
import { Button, Box, Typography, Modal } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { confirmAlert } from 'react-confirm-alert';
import classnames from 'classnames/bind';
import { toast } from 'react-toastify';
import 'react-confirm-alert/src/react-confirm-alert.css';

import ManageTrackTable from '~/components/admin/Table/ManageTrackTable';
import Detail from '~/components/admin/Detail';
import axiosInstance from '~/api/axiosInstance';
import { deletePodcastUrl, toggleReleasePodcastUrl } from '~/api/urls/podcastsUrl';
import styles from './styles.scoped.scss';

const cx = classnames.bind(styles);

const PodcastActionsMenu = ({ handleUpdateData, row }) => {
    const [openDetailModal, setOpenDetailModal] = useState(false);
    const [openTracksModal, setOpenTracksModal] = useState(false);

    const { t } = useTranslation();

    const handleToggleRelease = async () => {
        const { data } = await axiosInstance.put(toggleReleasePodcastUrl(row._id), {});

        handleUpdateData();
        toast.success(data.message);
    };

    const handleDeletePodcast = async () => {
        const { data } = await axiosInstance.delete(deletePodcastUrl(row._id));

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
                {t('Episodes')}
            </Button>
            <Button
                variant='contained'
                sx={{ minWidth: '100px' }}
                onClick={() =>
                    confirmAlert({
                        title: t('Confirm to toggle release'),

                        message: t('Are you sure to do this.'),
                        buttons: [
                            {
                                label: t('Yes'),
                                onClick: handleToggleRelease,
                            },
                            {
                                label: t('No'),
                            },
                        ],
                    })
                }
            >
                {row.isReleased ? t('Unrelease') : t('Release')}
            </Button>
            <Button
                variant='contained'
                color='error'
                sx={{ minWidth: '100px' }}
                onClick={() =>
                    confirmAlert({
                        title: t('Confirm to delete this podcast'),

                        message: t('Are you sure to do this.'),
                        buttons: [
                            {
                                label: t('Yes'),
                                onClick: handleDeletePodcast,
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
                        {t('Podcast detail')}
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
                        {t('Episodes')}
                    </Typography>
                    <div
                        id='modal-tracks-description'
                        style={{
                            width: '100%',
                        }}
                    >
                        <ManageTrackTable type='podcast' id={row._id} handleUpdateData={handleUpdateData} />
                    </div>
                </Box>
            </Modal>
        </div>
    );
};

export default PodcastActionsMenu;