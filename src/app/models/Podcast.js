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
                trackType: { type: String, default: 'episode' },
                _id: false,
            },
        ],
        images: [{ type: String }],
        saved: { type: Number, default: 0 },
        categories: [{ type: String }],
        date: { type: String, required: true },
        month: { type: String, required: true },
        year: { type: String, required: true },
    },
    { timestamps: true },
);

const validatePodcast = (podcast) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        description: Joi.string().allow(''),
        episodes: Joi.array().items(Joi.object()),
        images: Joi.array().items(Joi.string()),
        categories: Joi.array().items(Joi.string()),
        date: Joi.string().required(),
        month: Joi.string().required(),
        year: Joi.string().required(),
    });

    return schema.validate(podcast);
};

const Podcast = mongoose.model('Podcast', podcastSchema);

module.exports = { Podcast, validatePodcast };
