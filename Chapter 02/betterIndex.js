// Same thing as index.js but using async and await to be less messy and cleaner

const fsPromises = require('fs').promises;
const path = require('path');

// Calls a bunch of random functions to show that they run in order
const fileOps = async () => {
    try {
        // Read data from file and then print it (showing order)
        const data = await fsPromises.readFile(path.join(__dirname, 'files', 'test.txt'), 'utf8');
        console.log(data);

        // Write data to new file
        await fsPromises.writeFile(path.join(__dirname, 'files', 'promiseWrite.txt'), data);

        // Append to newly written file
        await fsPromises.appendFile(path.join(__dirname, 'files', 'promiseWrite.txt'), '\n\nNice to meet you.');

        // Demonstrate rename functionality (rename promiseWrite to promiseComplete)
        await fsPromises.rename(path.join(__dirname, 'files', 'promiseWrite.txt'), path.join(__dirname, 'files', 'promiseComplete.txt'));

        // Print newly written data
        const newData = await fsPromises.readFile(path.join(__dirname, 'files', 'promiseComplete.txt'), 'utf8');
        console.log(newData);

    } catch (err) { // If any error occurs, simply output it
        console.log(err);
    }
}

fileOps()