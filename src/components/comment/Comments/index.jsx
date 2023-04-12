import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames/bind';
import { CircularProgress } from '@mui/material';

import { getComments } from '~/api/comment';
import styles from './styles.module.scss';
import Comment from '~/components/comment/Comment';

const cx = classNames.bind(styles);

const Comments = ({ contextId, contextType }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [showComments, setShowComments] = useState([]);
    const { comments } = useSelector((state) => state.comments);
    const dispatch = useDispatch();

    useEffect(() => {
        if (comments.length === 0) return;
        setShowComments(comments);
    }, [comments, contextId, contextType]);

    useEffect(() => {
        fetchComments(contextId, contextType);
    }, [contextId, contextType]);

    const fetchComments = async (contextId, contextType) => {
        setIsLoading(true);
        await getComments(dispatch, contextId, contextType);
        setIsLoading(false);
    };

    return (
        <div className={cx('container')}>
            {isLoading ? (
                <CircularProgress />
            ) : (
                showComments.map((comment, index) => <Comment key={index} comment={comment} />)
            )}
        </div>
    );
};

export default Comments;
