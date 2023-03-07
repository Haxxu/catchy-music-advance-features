import { useState } from 'react';
import { Button, Box, Typography, Modal } from '@mui/material';
import { confirmAlert } from 'react-confirm-alert';
import classnames from 'classnames/bind';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import 'react-confirm-alert/src/react-confirm-alert.css';

import Detail from '~/components/admin/Detail';
import axiosInstance from '~/api/axiosInstance';
import { deleteTrackUrl } from '~/api/urls/tracksUrls';
import styles from './styles.scoped.scss';

const cx = classnames.bind(styles);

const TrackActionsMenu = ({ handleUpdateData, row }) => {
    const [openDetailModal, setOpenDetailModal] = useState(false);

    const { t } = useTranslation();

    const handleDeleteTrack = async () => {
        const { data } = await axiosInstance.delete(deleteTrackUrl(row._id));

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
                color='error'
                sx={{ minWidth: '100px' }}
                onClick={() =>
                    confirmAlert({
                        title: t('Confirm to delete this track'),

                        message: t('Are you sure to do this.'),
                        buttons: [
                            {
                                label: t('Yes'),
                                onClick: handleDeleteTrack,
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
                aria-labelledby='modal-track-menu-title'
                aria-describedby='modal-track-menu-description'
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
                        id='modal-track-menu-title'
                        variant='h6'
                        component='h2'
                        sx={{ mt: 2, mb: 4, fontSize: '2rem' }}
                    >
                        {t('Track detail')}
                    </Typography>
                    <div
                        id='modal-track-menu-description'
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
        </div>
    );
};

export default TrackActionsMenu;
