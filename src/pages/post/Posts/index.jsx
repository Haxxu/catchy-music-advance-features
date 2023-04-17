import React, { useState, useEffect, useCallback } from 'react';
import classNames from 'classnames/bind';

import styles from './styles.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { getPosts } from '~/api/post';
import { CircularProgress } from '@mui/material';
import PostCard from '~/components/post/PostCard';

const cx = classNames.bind(styles);

const Posts = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [showPosts, setShowPosts] = useState([]);

    const { posts } = useSelector((state) => state.post);

    const dispatch = useDispatch();

    const fetchPosts = useCallback(async () => {
        setIsLoading(true);
        await getPosts(dispatch);
        setIsLoading(false);
    }, [dispatch]);

    useEffect(() => {
        fetchPosts().catch(console.error);
    }, [fetchPosts]);

    useEffect(() => {
        setShowPosts(posts);
    }, [posts]);

    return (
        <div className={cx('container')}>
            {isLoading ? <CircularProgress /> : showPosts.map((post, index) => <PostCard key={index} post={post} />)}
        </div>
    );
};

export default Posts;
