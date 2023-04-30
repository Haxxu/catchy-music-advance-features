const Joi = require('joi');
const mongoose = require('mongoose');
const { Schema } = mongoose;

const notificationSchema = new Schema(
    {
        owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        contextObject: {
            _id: { type: String },
            name: { type: String },
            image: { type: String },
            // album, podcast, episode
            type: { type: String, default: 'album' },
            url: { type: String },
        },
        playTrack: {
            trackId: { type: String, default: '' },
            trackContextId: { type: String, default: '' },
            trackType: { type: String, default: 'song' },
            context_uri: { type: String, default: '' },
            position: { type: Number, default: 0 },
            duration: { type: Number, default: 0 },
        },
        // new-album, new-podcast, new-episode
        type: { type: String, default: 'new-album' },
        addedAt: { type: Date, default: Date.now() },
        description: { type: String },
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
