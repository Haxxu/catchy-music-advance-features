const router = require('express').Router();

const authController = require('../app/controllers/AuthController');

// [POST] api/auth/login -> login and get token
router.post('/login', authController.login);

// [POST] api/auth/google_login -> google login and get token
router.post('/google_login', authController.googleLogin);

// [POST] api/auth/register => register (send active token to mail or create)
router.post('/register', authController.register);

// [POST] api/auth/active => active account
router.post('/active', authController.activeAccount);

module.exports = router;
