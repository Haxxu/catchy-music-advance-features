const paypal = require('paypal-rest-sdk');

class PaymentController {
    async createPayment(req, res, next) {
        console.log('loo');
        const create_payment_json = {
            intent: 'sale',
            payer: {
                payment_method: 'paypal',
            },
            redirect_urls: {
                return_url: 'http://localhost:3003/success',
                cancel_url: 'http://localhost:3003/cancel',
            },
            transactions: [
                {
                    item_list: {
                        items: [
                            {
                                name: 'Iphone 4S',
                                sku: '001',
                                price: '2.00',
                                currency: 'USD',
                                quantity: 1,
                            },
                        ],
                    },
                    amount: {
                        currency: 'USD',
                        total: '2.00',
                    },
                    description: 'Iphone 4S cũ giá siêu rẻ',
                },
            ],
        };

        paypal.payment.create(create_payment_json, function (error, payment) {
            if (error) {
                throw error;
            } else {
                for (let i = 0; i < payment.links.length; i++) {
                    if (payment.links[i].rel === 'approval_url') {
                        console.log(payment.links[i].href);
                        res.status(200).json(payment.links[i].href);
                    }
                }
            }
        });
    }

    async createPaymentSuccess(req, res, next) {
        const payerId = req.query.PayerID;
        const paymentId = req.query.paymentId;

        const execute_payment_json = {
            payer_id: payerId,
            transactions: [
                {
                    amount: {
                        currency: 'USD',
                        total: '2.00',
                    },
                },
            ],
        };
        paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
            if (error) {
                console.log(error.response);
                throw error;
            } else {
                console.log(JSON.stringify(payment));
                res.status(200).json('Success (Mua hàng thành công)');
            }
        });
    }
}

module.exports = new PaymentController();
