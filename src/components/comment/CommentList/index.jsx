import React, { useState } from 'react';
import classNames from 'classnames/bind';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import styles from './styles.module.scss';
import { Link } from 'react-router-dom';
import CommentMenu from '~/components/CommentMenu';
import Like from '~/components/Like';

const cx = classNames.bind(styles);

const CommentList = ({ children, comment }) => {
    const [onReply, setOnReply] = useState(false);
    const [edit, setEdit] = useState(null);

    const handleDelete = () => {};
    const handleUpdate = () => {};

    const Nav = (comment) => {
        return (
            <div style={{ display: 'flex' }}>
                <div className='icon' onClick={() => handleDelete(comment)}>
                    <DeleteIcon width={20} height={20} />
                </div>
                <div className='icon' onClick={() => setEdit(comment)}>
                    <EditIcon />
                </div>
            </div>
        );
    };

    return (
        <div className={cx('container')} style={{ width: '100%' }}>
            <div className={cx('comment_box')}>
                <div className={cx('left')}>
                    <div className={cx('comment_header')}>
                        <Link
                            className={cx('comment_owner_name')}
                            to={`/${comment.owner.type === 'admin' ? 'user' : comment.owner.type}/${comment.owner._id}`}
                        >
                            {comment.owner.name}
                        </Link>
                    </div>

                    <div className={cx('comment_content')} dangerouslySetInnerHTML={{ __html: comment.content }} />

                    <div className={cx('comment_actions')}>
                        <small style={{ cursor: 'pointer' }} onClick={() => setOnReply(!onReply)}>
                            {onReply ? '- Cancel -' : '- Reply -'}
                        </small>

                        <CommentMenu comment={comment} handleDelete={handleDelete} />
                    </div>
                </div>

                <div className={cx('right')}>
                    <Like type='comment' commentId={comment._id} />
                    <div>{comment.likes.length}</div>
                </div>
            </div>
            {children}
        </div>
    );
};

export default CommentList;
