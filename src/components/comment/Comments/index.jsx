import React, { useState, useEffect } from 'react';
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
    const dispatch = useDispatch();

    useEffect(() => {
        if (comments.length === 0) return;
        setShowComments(comments);
        // console.log(comments);
    }, [comments, contextId, contextType, commentState]);

    useEffect(() => {
        fetchComments(contextId, contextType);
    }, [contextId, contextType]);

    const fetchComments = async (contextId, contextType) => {
        setIsLoading(true);
        await getComments(dispatch, contextId, contextType);
        setIsLoading(false);
    };

    const handleComment = async (body) => {
        const data = {
            content: body,
            contextId,
            contextType,
        };

        // console.log(data);

        const new_data = await createComment(dispatch, data);
        // setShowComments([new_data, ...showComments]);
    };

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
