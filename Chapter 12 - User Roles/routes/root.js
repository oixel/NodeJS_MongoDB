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

module.exports = router;