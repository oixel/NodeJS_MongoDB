const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (data) { this.users = data }
};

const bcrypt = require('bcrypt');

const handleLogin = async (req, res) => {
    const { username, password } = req.body;

    // If username or password is missing, give error
    if (!username || !password) return res.status(400).json({ 'message': 'Username and password are required.' });

    // Store user with given username into constant object
    const foundUser = usersDB.users.find(user => user.username === username);

    // If no user with given username was found, give a 401 error
    if (!foundUser) return res.sendStatus(401);  // Unauthorized

    // Evaluate password
    const match = await bcrypt.compare(password, foundUser.password);

    // If the password matches the one stored under the username, then return success!
    if (match) {
        // [WIP] Create JWTs here.

        // Success message
        res.json({ 'success': `user ${username} is logged in!` });
    }
    else {
        res.sendStatus(401);
    }
}

module.exports = { handleLogin }; 