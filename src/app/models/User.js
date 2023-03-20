const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const passwordComplexity = require('joi-password-complexity');

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String, default: '' },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        gender: { type: String, required: true },
        date: { type: String, required: true },
        month: { type: String, required: true },
        year: { type: String, required: true },
        nation: { type: String, default: '' },
        image: { type: String, default: '' },
        type: { type: String, required: true, default: 'user' },
        roles: { type: Array, default: ['user'] },
        genres: [{ type: String }],
        status: { type: String, default: 'actived' },
    },
    { timestamps: true },
);

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign(
        {
            _id: this._id,
            name: this.name,
            email: this.email,
            type: this.type,
        },
        process.env.JWT_PRIVATE_KEY,
        {
            expiresIn: '7d',
        },
    );

    return token;
};

const validateUser = (user) => {
    const schema = Joi.object({
        name: Joi.string().min(1).required(),
        email: Joi.string().email().required(),
        password: passwordComplexity().required(),
        confirm_password: Joi.any().valid(Joi.ref('password')).required(),
        date: Joi.string().required(),
        month: Joi.string().required(),
        year: Joi.string().required(),
        gender: Joi.string().valid('male', 'female', 'non-binary').required(),
    });

    return schema.validate(user);
};

const validateUpdatedPassword = (user) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: passwordComplexity().required(),
        newPassword: passwordComplexity().required(),
        confirm_newPassword: Joi.any().valid(Joi.ref('newPassword')).required(),
    });

    return schema.validate(user);
};

const User = mongoose.model('User', userSchema);

module.exports = { User, validateUser, validateUpdatedPassword };
