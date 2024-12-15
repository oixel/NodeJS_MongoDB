const fs = require('fs');

// This method gets data as raw data
fs.readFile('./files/test.txt', (err, data) => {
    if (err) throw err;
    console.log(data.toString());  // Convert raw data to legible string
});

// Alternatively, define encoding with second parameter
fs.readFile('./files/test.txt', 'utf8', (err, data) => {
    if (err) throw err;
    console.log(data);
});

// Interestingly, due to the asynchronous nature of NodeJS, console.log() will be called before output file data
// Handles console.log until readFile is done reading the file
console.log("Hello...");

//
//
//

const path = require('path');

// Alternative (and better) method of accessing file using path module
fs.readFile(path.join(__dirname, 'files', 'test.txt'), 'utf8', (err, data) => {
    if (err) throw err;
    console.log(data);
});

// Writing and appending to file example
fs.writeFile(path.join(__dirname, 'files', 'reply.txt'), 'Nice to meet you!', (err) => {
    if (err) throw err;
    console.log('Write complete');

    // Appending adds to a prexisting file and does not overwrite the initial values
    // Placed in writeFile to ensure that append occurs after write since async nature of JS could affect it otherwise
    fs.appendFile(path.join(__dirname, 'files', 'reply.txt'), '\n\nYes it is!', (err) => {
        if (err) throw err;
        console.log('Append complete');
    });
});

//
//
//



// Exit on uncaught errors (For example, if file does not exist)
process.on('uncaughtException', err => {
    console.error(`There was an uncaught error: ${err}`);  // Displays error message
    process.exit(1);
});