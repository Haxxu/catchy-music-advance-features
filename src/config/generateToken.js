const jwt = require('jsonwebtoken');

const { ACCESS_TOKEN_SECRET, ACTIVE_TOKEN_SECRET } = process.env;

const generateActiveToken = (payload) => {
    return jwt.sign(payload, `${ACTIVE_TOKEN_SECRET}`, {
        expiresIn: '5m',
    });
};

const generateAccessToken = (payload) => {
    return jwt.sign(payload, `${ACCESS_TOKEN_SECRET}`, {
        expiresIn: '7d',
    });
};

module.exports = { generateAccessToken, generateActiveToken };
