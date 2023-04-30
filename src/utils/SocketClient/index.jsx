import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    createCommentAction,
    deleteCommentAction,
    deleteReplyCommentAction,
    likeCommentAction,
    likeReplyCommentAction,
    replyCommentAction,
    updateCommentAction,
    updateReplyCommentAction,
} from '~/redux/commentSlice';
import { addNewNotifications } from '~/redux/notificationSlice';

const SocketClient = () => {
    const { socket } = useSelector((state) => state.socket);
    const dispatch = useDispatch();

    // Create Comment
    useEffect(() => {
        if (!socket) return;

        socket.on('createComment', (data) => {
            // console.log(data);
            dispatch(createCommentAction(data));
        });

        return () => {
            socket.off('createComment');
        };
    }, [socket, dispatch]);

    // Reply Comment
    useEffect(() => {
        if (!socket) return;

        socket.on('replyComment', (data) => {
            // console.log(data);
            dispatch(replyCommentAction(data));
        });

        return () => {
            socket.off('replyComment');
        };
    }, [socket, dispatch]);

    // Update Comment/Reply
    useEffect(() => {
        if (!socket) return;

        socket.on('updateComment', (data) => {
            if (data.commentRoot) {
                dispatch(updateReplyCommentAction(data));
            } else {
                dispatch(updateCommentAction(data));
            }
        });

        return () => {
            socket.off('updateComment');
        };
    }, [socket, dispatch]);

    // Delete Comment/Reply
    useEffect(() => {
        if (!socket) return;

        socket.on('deleteComment', (data) => {
            if (data.commentRoot) {
                dispatch(deleteReplyCommentAction(data));
            } else {
                dispatch(deleteCommentAction(data));
            }
        });

        return () => {
            socket.off('deleteComment');
        };
    }, [socket, dispatch]);

    // Like/Unlike Comment
    useEffect(() => {
        if (!socket) return;

        socket.on('likeComment', (data) => {
            if (data.commentRoot) {
                dispatch(likeReplyCommentAction(data));
            } else {
                dispatch(likeCommentAction(data));
            }
        });

        return () => {
            socket.off('likeComment');
        };
    }, [socket, dispatch]);

    useEffect(() => {
        if (!socket) return;

        socket.on('newNotification', (data) => {
            dispatch(addNewNotifications(data));
        });

        return () => {
            socket.off('newNotification');
        };
    }, [socket, dispatch]);

    return <div />;
};

export default SocketClient;
