const jwt = require('jsonwebtoken');

const { User } = require('../models/User');

module.exports = (req, res, next) => {
    const token = req.header('x-auth-token');

    if (!token) {
        return res.status(401).send({ message: 'Access denied, no token provided' });
    }

    jwt.verify(token, process.env.JWT_PRIVATE_KEY, async (error, validToken) => {
        if (error) {
            return res.status(401).send({ message: 'Invalid token' });
        } else {
            const user = await User.findOne({ email: validToken.email });

            if (user.type !== 'podcaster' && user.type !== 'admin') {
                return res.status(403).send({ message: "You don't have permission to access this content" });
            }
            req.user = validToken;
            req.user.type = user.type;
            next();
        }
    });
};
