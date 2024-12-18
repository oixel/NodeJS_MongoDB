const http = require('http');
const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;

const logEvents = require('./logEvents');

const EventEmitter = require('events');
class Emitter extends EventEmitter { };

// Initialize event emitter object
const myEmitter = new Emitter();

// When log is called, call the logEvents function and pass in proper parameters
myEmitter.on('log', (msg, fileName) => logEvents(msg, fileName));

// Try to use current port, or if none exists, simply use port 3500
const PORT = process.env.PORT || 3500;

const serveFile = async (filePath, contentType, response) => {
    try {
        const rawData = await fsPromises.readFile(
            filePath,
            // Prevents image loading errors since images are not utf8
            !contentType.includes('image') ? 'utf8' : ''
        );

        // If the requested data is of type JSON, parse it for clean formatting, otherwise, let it be
        const data = contentType === 'application/json' ? JSON.parse(rawData) : rawData;

        // Write to reponse the success code and content type of requested data
        response.writeHead(
            filePath.includes('404.html') ? 404 : 200,
            { 'Content-Type': contentType }
        );

        // If the content is of type json, take the parsed data and format it nicely
        response.end(
            contentType === 'application/json' ? JSON.stringify(data) : data
        );
    }
    // Writes errors to error log in relation to code not failed requests (ex: readFil instead of readFile)
    catch (err) {
        // Output error to console
        console.log(err);

        // If an error, occur store it in the error log text file
        myEmitter.emit('log', `${err.name}: ${err.message}`, 'errLog.txt');

        // Update response's status to 500 (error)
        response.statusCode = 500;

        // Signal that no more data will be written to response
        response.end();
    }
}

// Calls functionality when connection to server is created
const server = http.createServer((req, res) => {
    // Outputs request information
    console.log(req.url, req.method);

    // Store log of connection request to server in request log
    myEmitter.emit('log', `${req.url}\t${req.method}`, 'reqLog.txt');

    // Grabs the extension type from the path input
    const extension = path.extname(req.url);

    // Stores the type of the requested content
    let contentType;

    // Set content type based on the path's extension
    switch (extension) {
        case '.css':
            contentType = 'text/css';
            break;
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.jpg':
            contentType = 'image/jpeg';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.txt':
            contentType = 'text/plain';
            break;
        default:
            contentType = 'text/html';
    }

    let filePath;

    // Set file path to reflect inputted url
    // If path is basic request, set file to main index
    if (contentType === 'text/html' && req.url === '/') {
        filePath = path.join(__dirname, 'views', 'index.html');
    }
    // Sets file to index of desired path if it ends with a slash
    else if (contentType === 'text/html' && req.url.slice(-1) === '/') {
        filePath = path.join(__dirname, 'views', req.url, 'index.html');
    }
    // If path does not end in a slash, but is HTML, set file to the HTML file at requested URL
    else if (contentType === 'text/html') {
        filePath = path.join(__dirname, 'views', req.url);
    }
    // Otherwise, if request is not a HTML file, set file to requested URL
    else {
        filePath = path.join(__dirname, req.url);
    }

    // Makes it so that the .html extension gets added to requests without it
    if (!extension && req.url.slice(-1) !== '/') filePath += '.html';

    // Stores boolean on whether the inputted file path actually exists
    const fileExists = fs.existsSync(filePath);

    // If desired file exists, then serve its contents; otherwise, return proper error page
    if (fileExists) {
        serveFile(filePath, contentType, res);
    }
    else {
        switch (path.parse(filePath).base) {
            case 'old-page.html':
                // This 301 indicates that a requested page has been moved to a new URL
                res.writeHead(301, { 'Location': '/new-page.html' });
                res.end();  // Signal that no more data will be written to response
                break;
            case 'www-page.html':
                // Similar 301 redirect error but instead redirects to main index
                res.writeHead(301, { 'Location': '/' });
                res.end();
                break;
            default:
                // If not a redirect error, then a 404 error (Page not found)
                serveFile(path.join(__dirname, 'views', '404.html'), 'text/html', res);
        }
    }
});

// Output port connection information
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Add listener for the log event
// myEmitter.on('log', (msg) => logEvents(msg));

