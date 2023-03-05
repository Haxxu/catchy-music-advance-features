const mongoose = require('mongoose');
const Joi = require('joi');

const { Schema } = mongoose;

const genreSchema = new Schema(
    {
        name: { type: String, required: true },
        description: { type: String, default: '' },
        image: { type: String, default: '' },
    },
    { timestamps: true },
);

const validateGenre = (genre) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        description: Joi.string(),
        image: Joi.string(),
    });

    return schema.validate(genre);
};

const Genre = mongoose.model('Genre', genreSchema);

module.exports = { Genre, validateGenre };
