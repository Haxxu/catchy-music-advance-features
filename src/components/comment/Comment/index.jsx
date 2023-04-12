import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';

import styles from './styles.module.scss';
import AvatarComment from '../AvatarComment';
import CommentList from '../CommentList';
import AvatarReplyComment from '../AvatarReplyComment';

const cx = classNames.bind(styles);

const Comment = ({ comment }) => {
    const [showReply, setShowReply] = useState([]);
    const [next, setNext] = useState(2);

    useEffect(() => {
        if (!comment.replyComments) return;

        setShowReply(comment.replyComments);
    }, [comment.replyComments]);

    return (
        <div
            className={cx('container')}
            style={{
                opacity: comment._id ? 1 : 0.5,
                pointerEvents: comment._id ? 'initial' : 'none',
            }}
        >
            <AvatarComment user={comment.owner} />
            <CommentList comment={comment} showReply={showReply} setShowReply={setShowReply}>
                {showReply.slice(0, next).map((replyComment, index) => (
                    <div
                        key={index}
                        style={{
                            opacity: replyComment._id ? 1 : 0.5,
                            pointerEvents: replyComment._id ? 'initial' : 'none',
                            display: 'flex',
                        }}
                    >
                        <AvatarReplyComment user={replyComment.owner} replyUser={replyComment.replyUser} />
                        <CommentList comment={replyComment} showReply={showReply} setShowReply={setShowReply} />
                    </div>
                ))}

                <div style={{ cursor: 'pointer' }}>
                    {showReply.length - next > 0 ? (
                        <small
                            style={{ color: 'crimson', fontWeight: 700, fontSize: '1.4rem' }}
                            onClick={() => setNext((prev) => prev + 5)}
                        >
                            See more comments
                        </small>
                    ) : (
                        showReply.length > 2 && (
                            <small
                                style={{ color: 'teal', fontWeight: 700, fontSize: '1.4rem' }}
                                onClick={() => setNext(2)}
                            >
                                Hide comments...
                            </small>
                        )
                    )}
                </div>
            </CommentList>
        </div>
    );
};

export default Comment;
