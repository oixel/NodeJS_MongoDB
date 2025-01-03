// Required packages for using JWT authentication
const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyJWT = (req, res, next) => {
    // Grab authorization header (regardless if it is lower-case or upper)
    const authHeader = req.headers.authorization || req.headers.Authorization;

    // If header does not exist, or if header does exist but does not start with "Bearer "
    // then give an unsuccessful request error
    if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);

    // console.log(authHeader);  // Bearer [token]

    // Grab token attribute from authorization header
    const token = authHeader.split(' ')[1];

    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return res.sendStatus(403);  // 403 error means forbidden access (something about given token is off)
            req.user = decoded.UserInfo.username;
            req.roles = decoded.UserInfo.roles;
            next();
        }
    )
};

module.exports = verifyJWT;