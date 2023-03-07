import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from '@mui/material';
// import classNames from 'classnames/bind';

// import styles from './styles.scoped.scss';
import axiosInstance from '~/api/axiosInstance';
import { followUserUrl, unfollowUserUrl, checkFollowingUserUrl } from '~/api/urls/me';
import { updateUserPageState } from '~/redux/updateStateSlice';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

// const cx = classNames.bind(styles);

const FollowButton = ({ userId }) => {
    const [following, setFollowing] = useState(false);

    const dispatch = useDispatch();

    const { t } = useTranslation();

    const handleFollow = async () => {
        try {
            if (following) {
                const { data } = await axiosInstance.delete(unfollowUserUrl, {
                    data: { user: userId },
                });
                setFollowing(data.data);
                dispatch(updateUserPageState());
                toast.success(data.message);
            } else {
                const { data } = await axiosInstance.put(followUserUrl, { user: userId });
                setFollowing(data.data);
                dispatch(updateUserPageState());
                toast.success(data.message);
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await axiosInstance.get(checkFollowingUserUrl, { params: { id: userId } });
            setFollowing(data.data);
        };

        fetchData().catch(console.error);
        // eslint-disable-next-line
    }, [following]);

    return (
        <Button
            sx={{ fontSize: '1.6rem', fontWeight: '800' }}
            color='primary'
            variant='outlined'
            onClick={handleFollow}
        >
            {following ? t('FOLLOWING') : t('FOLLOW')}
        </Button>
    );
};

export default FollowButton;
