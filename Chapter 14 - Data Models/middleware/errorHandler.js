// Import logEents functionality from logEvents script to output errors to individual log
const { logEvents } = require('./logEvents');

// Moved errorHandler functionality to seperate script for cleaner code
const errorHandler = function (err, req, res, next) {
    // Use imported logEvents function
    logEvents(`${err.name}: ${err.message}`, 'errLog.txt');

    console.error(err.stack);
    res.status(500).send(err.message);  // 500: Internal server error
};

module.exports = errorHandler;