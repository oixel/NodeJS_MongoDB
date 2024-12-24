const { format } = require('date-fns');
const { v4: uuid } = require('uuid');

const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

// Writes log message to passed-in logFile in logs file
const logEvents = async (message, logFile) => {
    // Create formatted strings using string literals
    const dateTime = `${format(new Date(), 'MM/dd/yyyy\tHH:mm:ss')}`;
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

    // If there is any error, simply output it
    try {
        // If there is no logs directory, create it!
        if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) await fsPromises.mkdir(path.join(__dirname, '..', 'logs'));

        // Append new log message to end of log file
        await fsPromises.appendFile(path.join(__dirname, '..', 'logs', logFile), logItem);
    } catch (err) {
        // If error occurs, output it to console
        console.error(err);
    }
}

// Create middleware function as a seperate variable to export for cleaner code usage in server.js
const logger = (req, res, next) => {
    // Reuse previously created logEvents as express middleware
    logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, 'reqLog.txt');
    console.log(`${req.method} ${req.path}`);
    next();
};

// Export functionality
module.exports = { logger, logEvents };