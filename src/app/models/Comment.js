const mongoose = require('mongoose');
const { Schema } = mongoose;

const commentSchema = new Schema(
    {
        owner: { type: Schema.Types.ObjectId, ref: 'User' },
        track: { type: Schema.Types.ObjectId, ref: 'Track' },
        name: { type: String, required: true },
        content: { type: String, required: true },
        like: {
            items: [{ type: String }],
            total: { type: Number, default: 0 },
        },
    },
    { timestamps: true },
);

const Comment = mongoose.model('Comment', commentSchema);

module.exports = { Comment };
