const express = require('express');
const router = express.Router();
const path = require('path');

// Routing for subdir/index.html
router.get('^/$|/index(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'subdir', 'index.html'));
});

// Routing for subdir/test.html
router.get('^/$|/test(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'subdir', 'test.html'));
});

module.exports = router;