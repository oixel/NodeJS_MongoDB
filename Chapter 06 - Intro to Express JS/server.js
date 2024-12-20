const express = require('express');
const app = express();

const path = require('path');

// Try to use current port, or if none exists, simply use port 3500
const PORT = process.env.PORT || 3500;

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

// Catch all. If anything else that unknown is inputted, default to 404.
// Placed at bottom to ensure that all allowed requests are not overwritten
app.get('/*', (req, res) => {
    // Set status to 404 and then route to 404 page
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

// Output port connection information
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));