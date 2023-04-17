import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames/bind';
import { CircularProgress } from '@mui/material';

import { createComment, getComments } from '~/api/comment';
import styles from './styles.module.scss';
import Comment from '~/components/comment/Comment';
import Input from '../Input';

const cx = classNames.bind(styles);

const Comments = ({ contextId, contextType }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [showComments, setShowComments] = useState([]);
    const { comments } = useSelector((state) => state.comments);
    const { commentState } = useSelector((state) => state.updateState);
    const { socket } = useSelector((state) => state.socket);
    const dispatch = useDispatch();

    const fetchComments = useCallback(async (contextId, contextType) => {
        setIsLoading(true);
        await getComments(dispatch, contextId, contextType);
        setIsLoading(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleComment = async (body) => {
        const data = {
            content: body,
            contextId,
            contextType,
        };

        // console.log(data);

        await createComment(dispatch, data);
        // setShowComments([new_data, ...showComments]);
    };

    useEffect(() => {
        // if (comments.length === 0) return;
        setShowComments(comments);
        // console.log(comments);
    }, [comments, contextId, contextType, commentState]);

    useEffect(() => {
        fetchComments(contextId, contextType);
    }, [contextId, contextType, fetchComments]);

    useEffect(() => {
        if (!contextId || !socket) return;

        socket && socket.emit('joinRoom', contextId);

        return () => {
            socket.emit('outRoom', contextId);
        };
    }, [contextId, socket]);

    return (
        <div className={cx('container')}>
            <Input callback={handleComment} />
            {isLoading ? (
                <CircularProgress />
            ) : (
                showComments.map((comment, index) => <Comment key={index} comment={comment} />)
            )}
        </div>
    );
};

export default Comments;
