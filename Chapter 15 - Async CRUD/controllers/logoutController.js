// Import User schema from its file
const User = require('../model/User');

// Needed to access current users in our JSON-based database
const fsPromises = require('fs').promises;
const path = require('path');

const handleLogout = async (req, res) => {
    // On client, also delete the access token

    // Get request's cookies
    const cookies = req.cookies;

    // If cookies are missing or IF cookies, but no jwt property, give error
    if (!cookies?.jwt) return res.sendStatus(204);  // 204: No content to give back

    // Grab refresh token from cookies' jwt attribute
    const refreshToken = cookies.jwt;

    // Store user with given refresh token into constant object
    const foundUser = await User.findOne({ refreshToken }).exec();

    // If no user with given refresh token was found, remove found cookie, but also give error that no content (user) was found
    if (!foundUser) {
        res.clearCookie('jwt', { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
        return res.sendStatus(204);  // Forbidden
    }

    // Delete refresh token in database
    foundUser.refreshToken = '';
    const result = await foundUser.save();

    // Erase cookies (same properties as creation are needed in clearing)
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 });

    // Send successful status
    res.sendStatus(204);
}

module.exports = { handleLogout };