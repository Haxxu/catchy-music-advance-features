const Joi = require('joi');
const mongoose = require('mongoose');
const { Schema } = mongoose;

const lyricSchema = new Schema(
    {
        owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        track: { type: Schema.Types.ObjectId, ref: 'Track', required: true },
        content: { type: String, required: true },
        nation: { type: String, required: true },
        providedBy: { type: String, default: 'N/A' },
    },
    { timestamps: true },
);

const validateLyric = (lyric) => {
    const schema = Joi.object({
        track: Joi.string().required(),
        content: Joi.string().required(),
        nation: Joi.string().required(),
        providedBy: Joi.string(),
    });

    return schema.validate(lyric);
};

const Lyric = mongoose.model('Lyric', lyricSchema);

module.exports = { Lyric, validateLyric };
