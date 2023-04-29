const Joi = require('joi');
const mongoose = require('mongoose');
const { Schema } = mongoose;

const notificationSchema = new Schema(
    {
        owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        trackType: { type: String, default: 'song' },
        trackContextId: { type: String, default: '' },
        context_uri: { type: String, default: '' },
        type: { type: String, default: 'new-album' },
        addedAt: { type: Date, default: Date.now() },
        description: { type: String },
        duration: { type: Number, default: 0 },
        artists: [
            {
                name: { type: String },
                id: { type: String },
                url: { type: String },
                _id: false,
            },
        ],
    },
    { timestamps: true },
);

// const validateNotification = (lyric) => {
//     const schema = Joi.object({
//         track: Joi.string().required(),
//         content: Joi.string().required(),
//         nation: Joi.string().required(),
//         providedBy: Joi.string(),
//     });

//     return schema.validate(lyric);
// };

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = { Notification };
