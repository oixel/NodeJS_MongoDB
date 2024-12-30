// Required packages for using JWT authentication
const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyJWT = (req, res, next) => {
    // Grab authorization header
    const authHeader = req.headers['authorization'];

    // If header does not exist, then there is an unsuccessful request error
    if (!authHeader) return res.sendStatus(401);

    // console.log(authHeader);  // Bearer [token]

    // Grab token attribute from authorization header
    const token = authHeader.split(' ')[1];

    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return res.sendStatus(403);  // 403 error means forbidden access (something about given token is off)
            req.user = decoded.username;
            next();
        }
    )
};

module.exports = verifyJWT;