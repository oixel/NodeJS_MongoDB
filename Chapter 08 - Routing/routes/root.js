const express = require('express');
const router = express.Router();
const path = require('path');

// Specify the HTTP method that we want to route
// Regex explanation:
// If request starts with '/' and ends with '/' OR request is /index (with or without .html)
router.get('^/$|/index(.html)?', (req, res) => {
    // One method of serving our file:
    // res.sendFile('./views/index.html', { root: __dirname });

    // Another method to serve file similar to what we have been doing
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});

// Route new-page request to new-page HTML
router.get('/new-page(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'new-page.html'));
});

// Handles redirect of accessing old page
router.get('/old-page(.html)?', (req, res) => {
    // If user tries to access old page, redirect to new page
    res.redirect(301, '/new-page.html');  // Status code of 302 by default (301 means permanent move of page, 302 means temporary)
});

module.exports = router;