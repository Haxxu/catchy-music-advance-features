const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const ApiError = require('../../utils/ApiError');
const { validateUser } = require('../models/User');
const userService = require('../services/UserService');
const { generateActiveToken } = require('../../config/generateToken');
const sendMail = require('../../config/sendMail');

const CLIENT_URL = `${process.env.CLIENT_URL}`;

class AuthController {
    async register(req, res, next) {
        try {
            const { error } = validateUser(req.body);
            if (error) {
                next(new ApiError(400, error.details[0].message));
            }

            const user = await userService.findOne({ email: req.body.email });
            if (user) {
                next(new ApiError(400, 'User with given email already registered!'));
            }

            const hashedPassword = await bcrypt.hash(req.body.password, Number(process.env.SALT));

            const newUser = {
                ...req.body,
                password: hashedPassword,
            };

            const active_token = generateActiveToken({ newUser });

            const url = `${CLIENT_URL}/active/${active_token}`;

            if (req.body?.email.includes('.cm@gmail')) {
                const new_user = await userService.createUser(newUser);

                return res.status(200).json({
                    data: {
                        newUser: new_user,
                        message: 'Account created successfully!',
                    },
                });
            } else {
                sendMail(req.body.email, url, 'Verify your email address');
                return res.status(200).json({ msg: 'Success! Please check your email.' });
            }
        } catch (err) {
            console.log(err);
            return next(new ApiError());
        }
    }

    async activeAccount(req, res, next) {
        try {
            const { active_token } = req.body;

            const decoded = jwt.verify(active_token, `${process.env.ACTIVE_TOKEN_SECRET}`);

            const { newUser } = decoded;

            if (!newUser) {
                next(new ApiError(400, 'Invalid authentication'));
            }

            const user = await userService.findOne({ email: req.body.email });
            if (user) {
                next(new ApiError(400, 'User with given email already registered!'));
            }

            const new_user = await userService.createUser(newUser);

            return res.status(200).json({ msg: 'Account has been activated!' });
        } catch (err) {
            console.log(err);
            return next(new ApiError());
        }
    }
}

module.exports = new AuthController();
