import React, { useState } from 'react';
import classNames from 'classnames/bind';
import { ClickAwayListener, IconButton, Paper, Popper } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { routes } from '~/config';
import styles from './styles.module.scss';

const cx = classNames.bind(styles);

const UserMenu = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();

    const { t } = useTranslation();

    const handleClick = (e) => {
        setAnchorEl(anchorEl ? null : e.currentTarget);
    };

    const handleClickAway = () => {
        setAnchorEl(null);
    };

    const editProfile = async () => {
        navigate(routes.profile);
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
                            <div className={cx('menu-item')} onClick={editProfile}>
                                {t('Edit Profile')}
                            </div>
                        </div>
                    </Paper>
                </ClickAwayListener>
            </Popper>
        </div>
    );
};

export default UserMenu;
