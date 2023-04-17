import React from 'react';
import { useParams } from 'react-router-dom';
import Comments from '~/components/comment/Comments';

const CommentsOfPost = () => {
    const { id } = useParams();

    return (
        <div>
            <h1>Comment</h1>
            <Comments contextId={id} contextType='post' />
        </div>
    );
};

export default CommentsOfPost;
