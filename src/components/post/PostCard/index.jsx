import React, { useState } from 'react';
import classNames from 'classnames/bind';
import CommentIcon from '@mui/icons-material/Comment';
import { IconButton } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import VerifiedIcon from '@mui/icons-material/Verified';

import styles from './styles.module.scss';
import Like from '~/components/Like';
import { getTimeGap } from '~/utils/Format/timeFormat';
import Comments from '~/components/comment/Comments';
import PostMenu from '~/components/post/PostMenu';
import { useNavigate } from 'react-router-dom';
import { deletePost } from '~/api/post';
import { useDispatch } from 'react-redux';
import { routes } from '~/config';

const cx = classNames.bind(styles);

const PostCard = ({ post }) => {
    const { owner, image, title, description, createdAt } = post;

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [openComment, setOpenComment] = useState(false);

    const handleOpenComment = () => {
        setOpenComment(true);
    };

    const handleCloseComment = () => {
        setOpenComment(false);
    };

    const navigateToUser = () => {
        navigate(`/${owner.type}/${owner._id}`);
    };

    const navigateEdit = () => {
        navigate(`${routes.managePosts_posts}/${post._id}`);
    };

    const handleDelete = async () => {
        await deletePost(dispatch, post);
    };

    return (
        <div className={cx('post-card')}>
            <div className={cx('post-card-header')}>
                <div className={cx('left')}>
                    <img
                        src={owner.image}
                        alt={`${owner.name}'s avatar`}
                        onClick={navigateToUser}
                        style={{ cursor: 'pointer' }}
                    />
                    <h4 className={cx('name')} onClick={navigateToUser} style={{ cursor: 'pointer' }}>
                        {owner.name}
                    </h4>
                    {(owner.type === 'podcaster' || owner.type === 'artist') && (
                        <VerifiedIcon sx={{ width: 20, height: 20 }} color='primary' />
                    )}
                    <span className={cx('time-gap')}>{getTimeGap(createdAt)}</span>
                </div>
                <div className={cx('right')}>
                    <PostMenu post={post} handleDelete={handleDelete} handleEdit={navigateEdit} />
                </div>
            </div>
            <div className={cx('post-card-image')}>
                <img src={image} alt={title} />
            </div>
            <div className={cx('post-card-actions')}>
                <Like type='post' size='medium' post={post} />
                <IconButton disableRipple onClick={handleOpenComment}>
                    <CommentIcon sx={{ width: '2.8rem', height: '2.8rem' }} />
                </IconButton>
            </div>
            <div className={cx('post-card-info')}>
                <span>{post.likes.length} likes</span>
            </div>
            <div className={cx('post-card-description')}>
                <h5>{title}</h5>
                <p>{description}</p>
            </div>

            {openComment && (
                <div className={cx('comment-container')}>
                    <div className={cx('header')}>
                        <h1>Comments</h1>
                        <IconButton disableRipple onClick={handleCloseComment} sx={{ padding: '1.2rem' }}>
                            <CancelIcon sx={{ width: '2.8rem', height: '2.8rem' }} />
                        </IconButton>
                    </div>
                    <Comments contextId={post._id} contextType='post' />
                </div>
            )}
        </div>
    );
};

export default PostCard;
