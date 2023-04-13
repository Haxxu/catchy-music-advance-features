const { Comment } = require('../models/Comment');

class CommentService {
    constructor(commentId) {
        thid.id = commentId;
    }
    static async deleteMany(condition) {
        await Comment.deleteMany(condition);
    }

    static async createComment(payload) {
        const { owner, content, contextId, contextType, contextOwner } = payload;
        const new_comment = await new Comment({
            owner,
            content,
            contextId,
            contextType,
            contextOwner,
        }).save();
        (await new_comment.populate({ path: 'owner', select: '_id name image type' })).save();
        return new_comment;
    }

    static async createReplyComment(payload) {
        const { owner, content, contextId, contextType, contextOwner, commentRoot, replyUser } = payload;
        const new_comment = await new Comment({
            owner,
            content,
            contextId,
            contextType,
            contextOwner,
            commentRoot,
            replyUser,
        }).save();

        await Comment.findOneAndUpdate(
            { _id: commentRoot },
            {
                $push: { replyComments: new_comment._id },
            },
        );

        const populated_comment = await Comment.findById(new_comment._id)
            .populate({ path: 'owner', select: '_id name image type' })
            .populate({ path: 'replyUser', select: '_id name image type' });

        await populated_comment.save();

        return populated_comment;
    }

    static async findOne(condition) {
        return await Comment.findOne(condition);
    }
}

module.exports = CommentService;
