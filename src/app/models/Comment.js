const mongoose = require('mongoose');
const Joi = require('joi');
const { Schema } = mongoose;

const commentSchema = new Schema(
    {
        owner: { type: Schema.Types.ObjectId, ref: 'User' },
        contextOwner: { type: Schema.Types.ObjectId, ref: 'User' },
        contextId: { type: Schema.Types.ObjectId },
        // ContextType: song, episode, post
        contextType: { type: String, default: 'song' },
        content: { type: String, required: true },
        likes: [
            {
                user: { type: String, required: true },
                addedAt: { type: Date, default: Date.now() },
                _id: false,
            },
        ],
        replyComments: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Comment',
            },
        ],
        replyUser: { type: Schema.Types.ObjectId, ref: 'User' },
        commentRoot: { type: Schema.Types.ObjectId, ref: 'Comment' },
    },
    { timestamps: true },
);

const validateComment = (comment) => {
    const schema = Joi.object({
        content: Joi.string().required(),
        contextId: Joi.string().required(),
        contextType: Joi.string().default('song'),
    });

    return schema.validate(comment);
};

const validateReplyComment = (comment) => {
    const schema = Joi.object({
        content: Joi.string().required(),
        contextId: Joi.string().required(),
        contextType: Joi.string().default('song'),
        commentRoot: Joi.string().required(),
        replyUser: Joi.string().required(),
    });

    return schema.validate(comment);
};

const Comment = mongoose.model('Comment', commentSchema);

module.exports = { Comment, validateComment, validateReplyComment };
