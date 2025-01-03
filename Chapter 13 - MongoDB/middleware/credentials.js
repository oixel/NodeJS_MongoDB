const allowedOrigins = require('../config/allowedOrigins');

const credentials = (req, res, next) => {
    const origin = req.headers.origin;

    // If the origin of request is allowed, set header that CORS checks for to be true!
    if (allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Credentials', true);
    }

    next();
}

module.exports = credentials;