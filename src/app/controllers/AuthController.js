const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwt_decode = require('jwt-decode');

const { User } = require('../models/User');
const ApiError = require('../../utils/ApiError');
const { validateUser } = require('../models/User');
const userService = require('../services/UserService');
const { generateActiveToken } = require('../../config/generateToken');
const sendMail = require('../../config/sendMail');

const CLIENT_URL = `${process.env.CLIENT_URL}`;

class AuthController {
    async login(req, res, next) {
        try {
            const user = await User.findOne({ email: req.body.email });
            if (!user) {
                return res.status(400).send({ message: 'Invalid email or password' });
            }

            const validPassword = await bcrypt.compare(req.body.password, user.password);
            if (!validPassword) {
                return res.status(400).send({ message: 'Invalid email or password' });
            }

            const token = user.generateAuthToken();

            return res.status(200).send({ data: token, message: 'Signing in please wait...' });
        } catch (err) {
            console.log(err);
            return next(new ApiError());
        }
    }

    async googleLogin(req, res, next) {
        try {
            const { token: credential_token } = req.body;

            const decoded = jwt_decode(credential_token);

            const { email, email_verified, name, picture } = decoded;

            if (!email_verified) {
                next(new ApiError(500, 'Email verification failed.'));
            }

            const password = email + process.env.GOOGLE_LOGIN_SECRET;
            const hashedPassword = await bcrypt.hash(password, Number(process.env.SALT));

            const user = await userService.findOne({ email });

            let token;

            if (user) {
                const validPassword = await bcrypt.compare(password, user.password);
                if (!validPassword) {
                    next(new ApiError(400, 'Invalid email or password'));
                }

                token = user.generateAuthToken();
            } else {
                const newUser = {
                    name,
                    image: picture,
                    email,
                    month: 'january',
                    date: '1',
                    year: '2001',
                    gender: 'male',
                    password: hashedPassword,
                };

                const new_user = await userService.createUser(newUser);

                token = new_user.generateAuthToken();
            }

            return res.status(200).send({ data: token, message: 'Signing in please wait...' });
        } catch (err) {
            console.log(err);
            return next(new ApiError());
        }
    }

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
