const Joi = require('joi');
const mongoose = require('mongoose');
const { Schema } = mongoose;

const trackSchema = new Schema(
    {
        owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        name: { type: String, required: true },
        artists: [
            {
                name: { type: String, required: true },
                id: { type: Schema.Types.ObjectId, ref: 'User' },
                _id: false,
            },
        ],
        audio: { type: String, required: true },
        image: { type: String, required: true },
        duration: { type: Number, required: true, default: 0 },
        genres: [String],
        plays: { type: Number, default: 0 },
        saved: { type: Number, default: 0 },
        lyrics: [String],
    },
    { timestamps: true },
);

const validateTrack = (track) => {
    const schema = Joi.object({
        name: Joi.string().min(1).required(),
        audio: Joi.string().required(),
        image: Joi.string(),
        duration: Joi.number().required(),
        genres: Joi.array().items(Joi.string()),
        artists: Joi.array().items(Joi.object()),
    });

    return schema.validate(track);
};

const Track = mongoose.model('Track', trackSchema);

module.exports = { Track, validateTrack };
