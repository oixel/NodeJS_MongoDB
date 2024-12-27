// Cross Origin Resource Sharing

// Sources allowed to access backend using CORS
const whitelist = [
    'https://www.yoursite.com',
    'http://127.0.0.1:5500',
    'http://localhost:3500'
];

const corsOptions = {
    origin: (origin, callback) => {
        // If the origin trying to access backend is allowed, send null errors and true boolean
        if (whitelist.indexOf(origin) !== -1 || !origin) {  // !origin covers undefined origin (localhost:3500 in browser)
            callback(null, true);
        }
        else {  // Otherwise, send error message
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200
};

module.exports = corsOptions;