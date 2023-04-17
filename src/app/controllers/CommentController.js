const { default: mongoose } = require('mongoose');
const ApiError = require('../../utils/ApiError');
const { validateComment, validateReplyComment, Comment } = require('../models/Comment');
const CommentService = require('../services/CommentService');
const TrackService = require('../services/TrackService');
const UserService = require('../services/UserService');
const { Post } = require('../models/Post');

class CommentController {
    async createComment(req, res, next) {
        try {
            const { error } = validateComment(req.body);
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }

            const { content, contextId, contextType } = req.body;

            let context;

            if (contextType === 'episode') {
                context = await TrackService.findOne({ _id: contextId, type: 'episode' });
            } else if (contextType === 'post') {
                context = await Post.findOne({ _id: contextId });
            } else {
                context = await TrackService.findOne({ _id: contextId, type: 'song' });
            }

            if (!context) {
                return res.status(404).json({ message: 'Context not found.' });
            }

            const payload = {
                content,
                contextId,
                contextType,
                owner: req.user._id,
                contextOwner: context.owner,
            };

            const newComment = await CommentService.createComment(payload);

            const { io } = require('../../index');
            io.to(`${contextId}`).emit('createComment', newComment);

            return res.status(200).json({ data: newComment, message: 'Create comment successfully' });
        } catch (err) {
            console.log(err);
            return next(new ApiError());
        }
    }

    async replyComment(req, res, next) {
        try {
            const { error } = validateReplyComment(req.body);
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }

            const { content, contextId, contextType, commentRoot, replyUser } = req.body;

            let context;

            if (contextType === 'episode') {
                context = await TrackService.findOne({ _id: contextId, type: 'episode' });
            } else if (contextType === 'post') {
                context = await Post.findOne({ _id: contextId });
            } else {
                context = await TrackService.findOne({ _id: contextId, type: 'song' });
            }

            if (!context) {
                return res.status(404).json({ message: 'Context not found.' });
            }

            const comment_root = await CommentService.findOne({ _id: commentRoot });
            if (!comment_root) {
                return res.status(404).json({ message: 'Comment root not found.' });
            }

            const reply_user = await UserService.findOne({ _id: replyUser });
            if (!reply_user) {
                return res.status(404).json({ message: 'Reply user not found.' });
            }

            const payload = {
                content,
                contextId,
                contextType,
                owner: req.user._id,
                contextOwner: context.owner,
                commentRoot,
                replyUser,
            };

            const newReplyComment = await CommentService.createReplyComment(payload);

            const { io } = require('../..');
            io.to(`${newReplyComment.contextId}`).emit('replyComment', newReplyComment);

            return res.status(200).json({ data: newReplyComment, message: 'Create reply comment successfully' });
        } catch (err) {
            console.log(err);
            return next(new ApiError());
        }
    }

    async updateCommentById(req, res, next) {
        try {
            const { content } = req.body;

            const comment = await CommentService.findOne({ _id: req.params.id });
            if (!comment) {
                return res.status(404).json({ message: 'Comment not found' });
            }

            if (req.user._id !== comment.owner.toString()) {
                return res.status(403).json({ message: 'You dont have permission to update this comment' });
            }

            const updated_comment = await Comment.findOneAndUpdate(
                { _id: req.params.id, owner: req.user._id },
                { content },
                { new: true },
            );

            if (!updated_comment) {
                return res.status(404).json({ message: 'Update comment failure.' });
            }

            // Socket update
            const { io } = require('../..');
            io.to(`${updated_comment.contextId}`).emit('updateComment', updated_comment);

            return res.status(200).json({ data: updated_comment, message: 'Update comment successfully' });
        } catch (err) {
            console.log(err);
            return next(new ApiError());
        }
    }

    async deleteCommentById(req, res, next) {
        try {
            const comment = await CommentService.findOne({ _id: req.params.id });
            if (!comment) {
                res.status(404).json({ message: 'Comment not found' });
            }

            if (req.user._id !== comment.owner.toString() && req.user._id !== comment.contextOwner.toString()) {
                return res.status(403).json({ message: 'You dont have permission to update this comment' });
            }

            const deleted_comment = await Comment.findOneAndDelete({ _id: req.params.id });

            if (deleted_comment.commentRoot) {
                // Delete comment in replyComments (reply comment)
                await Comment.findOneAndUpdate(
                    {
                        _id: deleted_comment.commentRoot,
                    },
                    {
                        $pull: {
                            replyComments: deleted_comment._id,
                        },
                    },
                );
            } else {
                // Delete comment and all reply comments (commentRoot)
                await Comment.deleteMany({ _id: { $in: deleted_comment.replyComments } });
            }

            const { io } = require('../..');
            io.to(`${deleted_comment.contextId}`).emit('deleteComment', deleted_comment);

            return res.status(200).json({ data: deleted_comment, message: 'Delete comment successfully' });
        } catch (err) {
            console.log(err);
            return next(new ApiError());
        }
    }

    async getComments(req, res, next) {
        try {
            const data = await Comment.aggregate([
                {
                    $facet: {
                        totalData: [
                            {
                                $match: {
                                    contextId: new mongoose.Types.ObjectId(req.query.contextId),
                                    commentRoot: { $exists: false },
                                    replyUser: { $exists: false },
                                },
                            },
                            {
                                $lookup: {
                                    from: 'users',
                                    let: { owner_id: '$owner' },
                                    pipeline: [
                                        {
                                            $project: { name: 1, image: 1, type: 1 },
                                        },
                                        {
                                            $match: {
                                                $expr: {
                                                    $eq: ['$_id', '$$owner_id'],
                                                },
                                            },
                                        },
                                    ],
                                    as: 'owner',
                                },
                            },
                            {
                                $unwind: '$owner',
                            },
                            {
                                $lookup: {
                                    from: 'comments',
                                    let: { reply_cms: '$replyComments' },
                                    pipeline: [
                                        {
                                            $match: {
                                                $expr: {
                                                    $in: ['$_id', '$$reply_cms'],
                                                },
                                            },
                                        },
                                        {
                                            $lookup: {
                                                from: 'users',
                                                let: { owner_id: '$owner' },
                                                pipeline: [
                                                    {
                                                        $project: { name: 1, image: 1, type: 1 },
                                                    },
                                                    {
                                                        $match: {
                                                            $expr: {
                                                                $eq: ['$_id', '$$owner_id'],
                                                            },
                                                        },
                                                    },
                                                ],
                                                as: 'owner',
                                            },
                                        },
                                        { $unwind: '$owner' },
                                        {
                                            $lookup: {
                                                from: 'users',
                                                let: { reply_user_id: '$replyUser' },
                                                pipeline: [
                                                    {
                                                        $project: { name: 1, image: 1, type: 1 },
                                                    },
                                                    {
                                                        $match: {
                                                            $expr: {
                                                                $eq: ['$_id', '$$reply_user_id'],
                                                            },
                                                        },
                                                    },
                                                ],
                                                as: 'replyUser',
                                            },
                                        },
                                        { $unwind: '$replyUser' },
                                        {
                                            $addFields: {
                                                totalLikes: { $size: '$likes' },
                                            },
                                        },
                                    ],
                                    as: 'replyComments',
                                },
                            },
                            {
                                $addFields: {
                                    totalLikes: { $size: '$likes' },
                                },
                            },
                            { $sort: { createdAt: -1 } },
                        ],
                        totalCount: [
                            {
                                $match: {
                                    contextId: new mongoose.Types.ObjectId(req.query.contextId),
                                },
                            },
                            { $count: 'count' },
                        ],
                    },
                },
                {
                    $project: {
                        totalData: 1,
                        count: { $arrayElemAt: ['$totalCount.count', 0] },
                    },
                },
            ]);

            return res.status(200).json({
                data: {
                    comments: data[0].totalData,
                    totalComments: data[0].count,
                },
                message: 'Get comments successfully',
            });
        } catch (err) {
            console.log(err);
            return next(new ApiError());
        }
    }
}

module.exports = new CommentController();
