// Import User schema from its file
const User = require('../model/User');

const bcrypt = require('bcrypt');

// Required packages for using JWT authentication
const jwt = require('jsonwebtoken');

const handleLogin = async (req, res) => {
    const { username, password } = req.body;

    // If username or password is missing, give error
    if (!username || !password) return res.status(400).json({ 'message': 'Username and password are required.' });

    // Attempt to get user with given username from MongoDB
    const foundUser = await User.findOne({ username: username }).exec();

    // If no user with given username was found, give a 401 error
    if (!foundUser) return res.sendStatus(401);  // Unauthorized

    // Evaluate password (Use Username: Merry Password: Christmas)
    const match = await bcrypt.compare(password, foundUser.password);

    // If the password matches the one stored under the username, then return success!
    if (match) {
        // Grab user's roles
        const roles = Object.values(foundUser.roles);

        // NOTE: Do not pass in password or anything that can pose security risk because if someone were to get access of
        // security token, they could get access to this information.
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "username": foundUser.username,
                    "roles": roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '30s' }
        )

        // Initialize refresh token which lasts for longer than access token
        const refreshToken = jwt.sign(
            { "username": foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }  // 1 day
        )

        // Saving refresh token with current user
        foundUser.refreshToken = refreshToken;
        const result = await foundUser.save();

        // Ensure refresh token is sent as HTTP Only to prevent it from being accessible to JavaScript
        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 });  // Set cookie's max age to 1 day

        // Sending access token as JSON is not vulnerable since it has such a short life span
        res.json({ accessToken });
    }
    else {
        res.sendStatus(401);
    }
}

module.exports = { handleLogin }; 