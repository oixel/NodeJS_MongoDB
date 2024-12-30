// Cross Origin Resource Sharing
const allowedOrigins = require('./allowedOrigins');

const corsOptions = {
    origin: (origin, callback) => {
        // If the origin trying to access backend is allowed, send null errors and true boolean
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {  // !origin covers undefined origin (localhost:3500 in browser)
            callback(null, true);
        }
        else {  // Otherwise, send error message
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200
};

module.exports = corsOptions;