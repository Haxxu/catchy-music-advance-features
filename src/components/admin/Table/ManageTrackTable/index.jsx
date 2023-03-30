import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import { confirmAlert } from 'react-confirm-alert';
import { Avatar, Button, capitalize } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { getTracksByContextUrl } from '~/api/urls/tracksUrls';
import { removeTrackFromAlbumUrl } from '~/api/urls/albumsUrl';
import { removeTrackFromPlaylistUrl } from '~/api/urls/playlistsUrl';
import { removeEpisodeFromPodcastUrl } from '~/api/urls/podcastsUrl';
import { fancyTimeFormat, dateFormat } from '~/utils/Format';
import styles from './styles.scoped.scss';
import axiosInstance from '~/api/axiosInstance';
import { toast } from 'react-toastify';

const cx = classNames.bind(styles);

const ManageTrackTable = ({ type, id, handleUpdateData }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const { t } = useTranslation();

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await axiosInstance.get(getTracksByContextUrl + `?type=${type}&id=${id}`);

            setData(data.data);
            setLoading(false);
        };

        fetchData().catch(console.error);
        // eslint-disable-next-line
    }, [id, handleUpdateData]);

    const handleRemoveTrackFromAlbum = async (trackId) => {
        try {
            const { data } = await axiosInstance.delete(removeTrackFromAlbumUrl(id), { data: { track: trackId } });
            handleUpdateData();

            toast.success(data.data.message);
        } catch (error) {
            console.error(error);
        }
    };

    const handleRemoveEpisodeFromPodcast = async (trackId) => {
        try {
            const { data } = await axiosInstance.delete(removeEpisodeFromPodcastUrl(id), { data: { track: trackId } });
            handleUpdateData();

            toast.success(data.data.message);
        } catch (error) {
            console.error(error);
        }
    };

    const handleRemoveTrackFromPlaylist = async (trackId, contextType, contextId) => {
        try {
            let context;
            if (contextType === 'episode') {
                context = {
                    podcast: contextId,
                };
            } else {
                context = {
                    album: contextId,
                };
            }
            const { data } = await axiosInstance.delete(removeTrackFromPlaylistUrl(id), {
                data: { track: trackId, ...context },
            });
            handleUpdateData();

            toast.success(data.data.message);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className={cx('container')}>
            <TableContainer component={Paper}>
                <Table
                    sx={{
                        minWidth: 650,
                        fontSize: '2rem',
                        '& th, & td': {
                            fontSize: '1.4rem',
                        },
                    }}
                    aria-label='simple table'
                >
                    <TableHead>
                        <TableRow>
                            <TableCell>{t('Image')}</TableCell>
                            <TableCell align='right'>{t('Name')}</TableCell>
                            {type === 'playlist' ? <TableCell align='right'>{t('Type')}</TableCell> : null}
                            {type === 'playlist' ? <TableCell align='right'>{t('Album/Podcast')}</TableCell> : null}
                            <TableCell align='right'>{t('Duration')}</TableCell>
                            <TableCell align='right'>{t('Plays')}</TableCell>
                            <TableCell align='right'>{t('Saved')}</TableCell>
                            <TableCell align='right'>{t('Added At')}</TableCell>
                            <TableCell align='right'>{t('Actions')}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {/* {loading ? <CircularProgress /> : null} */}
                        {loading ? (
                            <TableRow>
                                <TableCell>
                                    <CircularProgress />
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((item) => (
                                <TableRow key={item._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell component='th' scope='row'>
                                        <Avatar src={item.image} variant='square' alt={item.name} />
                                    </TableCell>
                                    <TableCell align='right'>{item.name}</TableCell>
                                    {type === 'playlist' ? (
                                        <TableCell align='right' style={{ textTransform: capitalize }}>
                                            {item.type}
                                        </TableCell>
                                    ) : null}
                                    {type === 'playlist' ? (
                                        <TableCell align='right'>
                                            {item.type === 'song' ? item.album : item.podcast}
                                        </TableCell>
                                    ) : null}
                                    <TableCell align='right'>{fancyTimeFormat(item.duration)}</TableCell>
                                    <TableCell align='right'>{item.plays}</TableCell>
                                    <TableCell align='right'>{item.saved}</TableCell>
                                    <TableCell align='right'>{dateFormat(item.addedAt)}</TableCell>
                                    <TableCell align='right'>
                                        <Button
                                            variant='contained'
                                            color='error'
                                            onClick={() =>
                                                confirmAlert({
                                                    title:
                                                        t(
                                                            `Confirm to remove this ${
                                                                type === 'podcast' ? 'episode' : 'song'
                                                            } from `,
                                                        ) + type,

                                                    message: t('Are you sure to do this.'),
                                                    buttons: [
                                                        {
                                                            label: t('Yes'),
                                                            onClick: () => {
                                                                if (type === 'album') {
                                                                    handleRemoveTrackFromAlbum(item._id);
                                                                } else if (type === 'playlist') {
                                                                    handleRemoveTrackFromPlaylist(
                                                                        item._id,
                                                                        item.type,
                                                                        item.type === 'song'
                                                                            ? item.albumId
                                                                            : item.podcastId,
                                                                    );
                                                                } else if (type === 'podcast') {
                                                                    handleRemoveEpisodeFromPodcast(item._id);
                                                                }
                                                            },
                                                        },
                                                        {
                                                            label: 'No',
                                                        },
                                                    ],
                                                    overlayClassName: 'overlay-custom-class-name ',
                                                })
                                            }
                                        >
                                            {t('Remove')}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                        {data.length === 0 && !loading ? (
                            <TableRow>
                                <TableCell align='center'>{t('No data')}</TableCell>
                            </TableRow>
                        ) : null}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default ManageTrackTable;
