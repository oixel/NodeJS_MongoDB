const { format } = require('date-fns');
const { v4: uuid } = require('uuid');

const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

// Writes log event to eventLog.txt in logs file
const logEvents = async (message) => {
    // Create formatted strings using string literals
    const dateTime = `${format(new Date(), 'MM/dd/yyyy\tHH:mm:ss')}`;
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`;
    console.log(logItem);

    // If there is any error, simply output it
    try {
        // If there is no logs directory, create it!
        if (!fs.existsSync(path.join(__dirname, 'logs'))) await fsPromises.mkdir(path.join(__dirname, 'logs'));

        await fsPromises.appendFile(path.join(__dirname, 'logs', 'eventLog.txt'), logItem);
    } catch (err) {
        console.error(err);
    }
}

module.exports = logEvents;