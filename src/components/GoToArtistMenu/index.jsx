import React, { useState } from 'react';
import classNames from 'classnames/bind';
import { ClickAwayListener, Paper, Popper } from '@mui/material';
import ArrowRightRoundedIcon from '@mui/icons-material/ArrowRightRounded';
import { useNavigate } from 'react-router-dom';

import styles from './styles.module.scss';

const cx = classNames.bind(styles);

const GoToArtistMenu = ({ artists, type = 'artist' }) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const navigate = useNavigate();

    const handleClick = (e) => {
        setAnchorEl(anchorEl ? null : e.currentTarget);
    };

    const handleClickAway = () => {
        setAnchorEl(null);
    };

    const goToArtistPage = (id) => {
        navigate(`/artist/${id}`);
    };

    const goToPodcasterPage = (id) => {
        navigate(`/podcaster/${id}`);
    };

    const handleGoToPage = (id) => {
        if (type === 'episode') {
            goToPodcasterPage(id);
        } else {
            goToArtistPage(id);
        }
    };

    return (
        <div className={cx('container')}>
            <div onClick={handleClick} className={cx('sub-menu')}>
                <div>Go to {type}s</div>
                <ArrowRightRoundedIcon className={cx('icon')} />
            </div>
            <Popper placement='left-start' open={Boolean(anchorEl)} anchorEl={anchorEl} sx={{ zIndex: 9999 }}>
                <ClickAwayListener onClickAway={handleClickAway}>
                    <Paper className={cx('menu-container')}>
                        <div className={cx('menu-list')}>
                            {artists.map((artist, index) => (
                                <div className={cx('menu-item')} key={index} onClick={handleGoToPage}>
                                    {artist.name}
                                </div>
                            ))}
                        </div>
                    </Paper>
                </ClickAwayListener>
            </Popper>
        </div>
    );
};

export default GoToArtistMenu;
