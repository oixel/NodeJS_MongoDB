const express = require('express');
const app = express();

const path = require('path');

const cors = require('cors');
const corsOptions = require('./config/corsOptions');  // Import CORS options from seperate file

// Try to use current port, or if none exists, simply use port 3500
const PORT = process.env.PORT || 3500;

// Only import the logger part of the logEvents exports
const { logger } = require('./middleware/logEvents');

// Import errorHandler function to use at bottom of this script to handle any received errors
const errorHandler = require('./middleware/errorHandler');

// Custom middleware logger using previously created logEvents script
app.use(logger);

// Use CORS with the options defined above
app.use(cors(corsOptions));

// Built-in middleware to handle URLEncoded data
// In other words, form data:
// 'content-type: application/x-www-form-urlencoded'
app.use(express.urlencoded({ extended: false }));

// Built-in middleware to handle json\
app.use(express.json());

// Serves static files from public folder (allows images and CSS styling to work properly!)
app.use(express.static(path.join(__dirname, '/public')));

// This routes any requests coming for the root directory
app.use('/', require('./routes/root'));

// Route for registering new users
app.use('/register', require('./routes/register'));

// Router for user authorization
app.use('/auth', require('./routes/auth'));

// API routing example
app.use('/employees', require('./routes/api/employees'));

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