const Joi = require('joi');
const mongoose = require('mongoose');
const { Schema } = mongoose;

const podcastSchema = new mongoose.Schema(
    {
        owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        name: { type: String, default: '' },
        description: { type: String, default: '' },
        episodes: [
            {
                track: { type: String, required: true },
                addedAt: { type: Date, default: Date.now() },
                _id: false,
            },
        ],
        images: [{ type: String }],
        saved: { type: Number, default: 0 },
        categories: [{ type: String }],
    },
    { timestamps: true },
);

const validatePodcast = (podcast) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        description: Joi.string().allow(''),
        images: Joi.array().items(Joi.string()),
    });

    return schema.validate(podcast);
};

const Playlist = mongoose.model('Playlist', podcastSchema);

module.exports = { Playlist, validatePlaylist };
