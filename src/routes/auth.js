const router = require('express').Router();
const bcrypt = require('bcrypt');

const { User } = require('../app/models/User');
const authController = require('../app/controllers/AuthController');

// [POST] api/auth/login -> login and get token
router.post('/login', async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(400).send({ message: 'Invalid email or password' });
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
        return res.status(400).send({ message: 'Invalid email or password' });
    }

    const token = user.generateAuthToken();
    res.status(200).send({ data: token, message: 'Signing in please wait...' });
});

// [POST] api/auth/register => register (send active token to mail or create)
router.post('/register', authController.register);

// [POST] api/auth/active => active account
router.post('/active', authController.activeAccount);

module.exports = router;
