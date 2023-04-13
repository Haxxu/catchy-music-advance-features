import React from 'react';
import { useParams } from 'react-router-dom';
import classNames from 'classnames/bind';

import styles from './styles.module.scss';
import Comments from '~/components/comment/Comments';

const cx = classNames.bind(styles);

const CommentsPage = () => {
    const { contextId, contextType } = useParams();

    return (
        <div className={cx('container')}>
            <h2 className={cx('title')}>Comments</h2>
            <Comments contextId={contextId} contextType={contextType} />
        </div>
    );
};

export default CommentsPage;
