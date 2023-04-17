import React, { useState } from 'react';
import classNames from 'classnames/bind';
import VerifiedIcon from '@mui/icons-material/Verified';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import styles from './styles.module.scss';
import CommentMenu from '~/components/comment/CommentMenu';
import Like from '~/components/Like';
import { getTimeGap } from '~/utils/Format/timeFormat';
import Input from '../Input';
import { useAuth } from '~/hooks';
import { replyComment, updateComment, deleteComment } from '~/api/comment';

const cx = classNames.bind(styles);

const CommentList = ({ children, comment }) => {
    const [onReply, setOnReply] = useState(false);
    const [editComment, setEditComment] = useState(null);
    const { userId } = useAuth();

    const dispatch = useDispatch();

    const handleUpdate = async (body) => {
        if (body === editComment.content) {
            return setEditComment(undefined);
        }

        const data = {
            content: body,
        };

        await updateComment(dispatch, editComment, data);
        setEditComment(undefined);
    };
    const handleReply = async (body) => {
        const data = {
            content: body,
            contextId: comment.contextId,
            contextType: comment.contextType,
            commentRoot: comment.commentRoot || comment._id,
            replyUser: comment.owner._id,
        };

        await replyComment(dispatch, data);

        setOnReply(false);
    };
    const handleDelete = async (comment) => {
        await deleteComment(dispatch, comment);
    };

    return (
        <div className={cx('container')} style={{ width: '100%' }}>
            {editComment ? (
                <Input callback={handleUpdate} edit={editComment} setEdit={setEditComment} />
            ) : (
                <div className={cx('comment_box')}>
                    <div className={cx('left')}>
                        <div className={cx('comment_header')}>
                            <Link
                                className={cx('comment_owner_name')}
                                to={`/${comment.owner.type === 'admin' ? 'user' : comment.owner.type}/${
                                    comment.owner._id
                                }`}
                            >
                                {comment.owner.name}
                            </Link>
                            {(comment.owner.type === 'podcaster' || comment.owner.type === 'artist') && (
                                <VerifiedIcon sx={{ width: 20, height: 20 }} color='primary' />
                            )}
                            &nbsp;
                            {comment.replyUser && (
                                <>
                                    reply to&nbsp;
                                    <Link
                                        className={cx('comment_reply_user')}
                                        to={`/${
                                            comment.replyUser?.type === 'admin' ? 'user' : comment.replyUser?.type
                                        }/${comment.replyUser?._id}`}
                                    >
                                        {comment.replyUser?.name}
                                    </Link>
                                    {(comment.replyUser.type === 'podcaster' ||
                                        comment.replyUser.type === 'artist') && (
                                        <VerifiedIcon sx={{ width: 20, height: 20 }} color='primary' />
                                    )}
                                </>
                            )}
                            &nbsp;
                            <div className={cx('comment_created_time')}>{getTimeGap(comment.createdAt)}</div>
                        </div>

                        <div className={cx('comment_content')} dangerouslySetInnerHTML={{ __html: comment.content }} />

                        <div className={cx('comment_actions')}>
                            <small
                                style={{ cursor: 'pointer', marginRight: '10px' }}
                                onClick={() => setOnReply(!onReply)}
                            >
                                {onReply ? '- Cancel -' : '- Reply -'}
                            </small>

                            {(userId === comment.owner._id || userId === comment.contextOwner) && (
                                <CommentMenu
                                    comment={comment}
                                    handleDelete={handleDelete}
                                    setEditComment={setEditComment}
                                />
                            )}
                        </div>
                    </div>

                    <div className={cx('right')}>
                        <Like type='comment' comment={comment} />
                        <div>{comment.likes.length}</div>
                    </div>
                </div>
            )}

            {onReply && <Input callback={handleReply} />}

            {children}
        </div>
    );
};

export default CommentList;
