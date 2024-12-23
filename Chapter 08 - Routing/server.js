const express = require('express');
const app = express();

const path = require('path');

const cors = require('cors');

// Try to use current port, or if none exists, simply use port 3500
const PORT = process.env.PORT || 3500;

// Only import the logger part of the logEvents exports
const { logger } = require('./middleware/logEvents');

// Import errorHandler function to use at bottom of this script to handle any received errors
const errorHandler = require('./middleware/errorHandler');

// Custom middleware logger using previously created logEvents script
app.use(logger);

// Cross Origin Resource Sharing
const whitelist = ['https://www.yoursite.com', 'http://127.0.0.1:5500', 'http://localhost:3500'];  // Sources allowed to access backend using CORS

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

// Use CORS with the options defined above
app.use(cors(corsOptions));

// Built-in middleware to handle URLEncoded data
// In other words, form data:
// 'content-type: application/x-www-form-urlencoded'
app.use(express.urlencoded({ extended: false }));

// Built-in middleware to handle json\
app.use(express.json());

// Serves static files from public folder (allows images and such to work properly!)
app.use(express.static(path.join(__dirname, '/public')));

// Specify the HTTP method that we want to route
// Regex explanation:
// If request starts with '/' and ends with '/' OR request is /index (with or without .html)
app.get('^/$|/index(.html)?', (req, res) => {
    // One method of serving our file:
    // res.sendFile('./views/index.html', { root: __dirname });

    // Another method to serve file similar to what we have been doing
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Route new-page request to new-page HTML
app.get('/new-page(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'new-page.html'));
});

// Handles redirect of accessing old page
app.get('/old-page(.html)?', (req, res) => {
    // If user tries to access old page, redirect to new page
    res.redirect(301, '/new-page.html');  // Status code of 302 by default (301 means permanent move of page, 302 means temporary)
});

//
// NOTE: You can chain route handlers
//

app.get('/hello(.html)?', (req, res, next) => {  // next parameter must be present in every part of chaing except last
    console.log('Attempted to load hello.html');
    next();  // Call next to move to next part of the chain
}, (req, res) => {  // See how this does not contain next as a parameter
    res.send('Hello World!');
});

// Alternative method of chaining (more common)
const one = (req, res, next) => {
    console.log('One');
    next();
}

const two = (req, res, next) => {
    console.log('Two');
    next();
}

const three = (req, res) => {  // See how last part of chain does not contain next
    console.log('Three');
    res.send('Chain complete!');
}

// This is how the route handlers are handled in this method
app.get('/chain(.html)?', [one, two, three]);

//
//
//

// Catch all. Any routing requests that made it to this point of the script results in a 404
app.all('*', (req, res) => {
    // Set status to 404 and then route to 404 page
    res.status(404);

    // If failed request is HTML, redirect to 404 page
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    }
    // Otherwise, handle responses for other data types
    else if (req.accepts('json')) {
        res.json({ error: "404 Not Found" });
    }
    else {
        res.type('txt').send("404 Not Found");
    }
});

// Error function to catch errors
app.use(errorHandler);

// Output port connection information
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));