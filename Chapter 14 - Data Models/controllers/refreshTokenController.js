const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (data) { this.users = data }
};

// Required packages for using JWT authentication
const jwt = require('jsonwebtoken');

const handleRefreshToken = (req, res) => {
    const cookies = req.cookies;

    // If cookies are missing or IF cookies, but no jwt property, give error
    if (!cookies?.jwt) return res.sendStatus(401);

    // Grab refresh token from cookies' jwt attribute
    const refreshToken = cookies.jwt;

    // Store user with given refresh token into constant object
    const foundUser = usersDB.users.find(user => user.refreshToken === refreshToken);

    // If no user with given refresh token was found, give a 401 error
    if (!foundUser) return res.sendStatus(401);  // Unauthorized

    // Evaluate JWT
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            // If there is an error or username does not match, give error of forbidden access
            if (err || foundUser.username !== decoded.username) return res.sendStatus(403);

            // Grab user's roles
            const roles = Object.values(foundUser.roles);

            // Get access token from JWT
            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "username": decoded.username,
                        "roles": roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '30s' }
            );

            // Export access token
            res.json({ accessToken });
        }
    )


}

module.exports = { handleRefreshToken };