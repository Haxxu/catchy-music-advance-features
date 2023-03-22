const Joi = require('joi');
const mongoose = require('mongoose');
const { Schema } = mongoose;

const albumSchema = new mongoose.Schema(
    {
        owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        name: { type: String, required: true, default: '' },
        description: { type: String, default: '' },
        image: { type: String, default: '' },
        tracks: [
            {
                track: { type: String, required: true },
                addedAt: { type: Date, default: Date.now() },
                trackType: { type: String, default: 'song' },
                _id: false,
            },
        ],
        isReleased: { type: Boolean, default: false },
        releaseDate: { type: Date, default: Date.now() },
        date: { type: String, required: true },
        month: { type: String, required: true },
        year: { type: String, required: true },
        saved: { type: Number, default: 0 },
        type: { type: String, required: true },
    },
    { timestamps: true },
);

const validateAlbum = (album) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        description: Joi.string().allow(''),
        image: Joi.string().allow(''),
        tracks: Joi.array().items(Joi.object()),
        date: Joi.string().required(),
        isReleased: Joi.boolean(),
        month: Joi.string().required(),
        year: Joi.string().required(),
        type: Joi.string().required(),
    });

    return schema.validate(album);
};

const Album = mongoose.model('Album', albumSchema);

module.exports = { Album, validateAlbum };
