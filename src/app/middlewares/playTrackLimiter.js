const { rateLimit } = require('express-rate-limit');

module.exports = rateLimit({
    windowMs: 0.2 * 60 * 1000, // 30s
    max: 1, // Limit each IP to 100 requests per `window` (here, per 30s)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
