import React, { useState } from 'react';
import classNames from 'classnames/bind';
// import { useDispatch } from 'react-redux';
import { ClickAwayListener, IconButton, Paper, Popper } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
// import { toast } from 'react-toastify';
// import { useNavigate } from 'react-router-dom';
// import { confirmAlert } from 'react-confirm-alert';

import styles from './styles.module.scss';

import { useAuth } from '~/hooks';
import { useTranslation } from 'react-i18next';

const cx = classNames.bind(styles);

const CommentMenu = ({ comment, handleDelete, setEditComment }) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const { userId } = useAuth();
    const { t } = useTranslation();

    const handleClick = (e) => {
        setAnchorEl(anchorEl ? null : e.currentTarget);
    };

    const handleClickAway = () => {
        setAnchorEl(null);
    };

    return (
        <div className={cx('container')} onDoubleClick={(e) => e.stopPropagation()}>
            <IconButton onClick={handleClick} disableRipple sx={{ padding: 0 }}>
                <MoreHorizIcon sx={{ color: 'var(--text-primary)', width: '24px', height: '24px', padding: 0 }} />
            </IconButton>
            <Popper placement='bottom-start' open={Boolean(anchorEl)} anchorEl={anchorEl} sx={{ zIndex: 500 }}>
                <ClickAwayListener onClickAway={handleClickAway}>
                    <Paper className={cx('menu-container')}>
                        <div className={cx('menu-list')}>
                            {(comment.owner._id === userId || comment.contextOwner === userId) && (
                                <div className={cx('menu-item')} onClick={() => setEditComment(comment)}>
                                    {t('Edit')}
                                </div>
                            )}
                            {comment.owner._id === userId && (
                                <div className={cx('menu-item')} onClick={() => handleDelete(comment)}>
                                    {t('Delete')}
                                </div>
                            )}
                        </div>
                    </Paper>
                </ClickAwayListener>
            </Popper>
        </div>
    );
};

export default CommentMenu;
