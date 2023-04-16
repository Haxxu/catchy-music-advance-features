const mongoose = require('mongoose');
const Joi = require('joi');

const { Schema } = mongoose;

const postSchema = new Schema(
    {
        owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        title: { type: String, required: true, trim: true },
        description: { type: String, default: '' },
        image: { type: String, default: '', trim: true },
        likes: [
            {
                user: {
                    type: String,
                    required: true,
                },
                addedAt: {
                    type: Date,
                    default: Date.now(),
                },
            },
        ],
    },
    { timestamps: true },
);

const validatePost = (post) => {
    const schema = Joi.object({
        title: Joi.string().min(1).required(),
        description: Joi.string().allow(''),
        image: Joi.string().allow(''),
    });

    return schema.validate(post);
};

const Post = mongoose.model('Post', postSchema);

module.exports = { Post, validatePost };
