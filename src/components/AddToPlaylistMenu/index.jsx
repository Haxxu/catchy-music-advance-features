import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import { ClickAwayListener, Paper, Popper } from '@mui/material';
import ArrowRightRoundedIcon from '@mui/icons-material/ArrowRightRounded';

import styles from './styles.module.scss';
import axiosInstance from '~/api/axiosInstance';
import { getSavedPlaylistsUrl } from '~/api/urls/me';
import { addTrackToPlaylistUrl } from '~/api/urls/playlistsUrl';
import { toast } from 'react-toastify';
import { useAuth } from '~/hooks';
import { useTranslation } from 'react-i18next';

const cx = classNames.bind(styles);

const AddToPlaylistMenu = ({ trackId, albumId }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [playlists, setPlaylists] = useState([]);

    const { userId } = useAuth();
    const { t } = useTranslation();

    const handleClick = (e) => {
        setAnchorEl(anchorEl ? null : e.currentTarget);
    };

    const handleClickAway = () => {
        setAnchorEl(null);
    };

    const addTrackToPlaylist = async (playlistId) => {
        try {
            const { data } = await axiosInstance.post(addTrackToPlaylistUrl(playlistId), {
                track: trackId,
                album: albumId,
            });
            toast.success(data.message);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await axiosInstance.get(getSavedPlaylistsUrl);
            setPlaylists(data.data);
            // console.log(data.data);
        };

        fetchData().catch(console.error);
    }, []);

    return (
        <div className={cx('container')}>
            <div onClick={handleClick} className={cx('sub-menu')}>
                <div>{t('Add to playlist')}</div>
                <ArrowRightRoundedIcon className={cx('icon')} />
            </div>
            <Popper placement='left-start' open={Boolean(anchorEl)} anchorEl={anchorEl} sx={{ zIndex: 9999 }}>
                <ClickAwayListener onClickAway={handleClickAway}>
                    <Paper className={cx('menu-container')}>
                        <div className={cx('menu-list')}>
                            {playlists.map(
                                (item, index) =>
                                    item?.playlist?.owner === userId && (
                                        <div
                                            className={cx('menu-item')}
                                            key={index}
                                            onClick={() => addTrackToPlaylist(item?.playlist?._id)}
                                        >
                                            {item?.playlist?.name}
                                        </div>
                                    ),
                            )}
                        </div>
                    </Paper>
                </ClickAwayListener>
            </Popper>
        </div>
    );
};

export default AddToPlaylistMenu;
