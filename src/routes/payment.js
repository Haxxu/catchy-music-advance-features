const router = require('express').Router();

const lyricController = require('../app/controllers/LyricController');
const paymentController = require('../app/controllers/PaymentController');
const userAuth = require('../app/middlewares/userAuth');
const adminAuth = require('../app/middlewares/adminAuth');
const validateObjectId = require('../app/middlewares/validateObjectId');

// [POST] /api
router.post('/', userAuth, paymentController.createPayment);
// [GET] /api/
router.get('/success', userAuth, paymentController.createPaymentSuccess);

module.exports = router;
