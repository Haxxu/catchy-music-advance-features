import React, { useState } from 'react';
import classNames from 'classnames/bind';
import { ClickAwayListener, IconButton, Paper, Popper } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { toast } from 'react-toastify';

import styles from './styles.module.scss';
import axiosInstance from '~/api/axiosInstance';
import { addItemsToQueueUrl } from '~/api/urls/me';
import { useTranslation } from 'react-i18next';

const cx = classNames.bind(styles);

const AlbumMenu = ({ tracks, albumId, albumOwnerId }) => {
    const [anchorEl, setAnchorEl] = useState(null);

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
                        </div>
                    </Paper>
                </ClickAwayListener>
            </Popper>
        </div>
    );
};

export default AlbumMenu;
