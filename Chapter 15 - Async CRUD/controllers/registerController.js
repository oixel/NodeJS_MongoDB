const User = require('../model/User');
const bcrypt = require('bcrypt');

// Define handler for the new user information we will receive at this register route
const handleNewUser = async (req, res) => {
    const { username, password } = req.body;

    // If username or password is missing, give error
    if (!username || !password) return res.status(400).json({ 'message': 'Username and password are required.' });

    // Check for duplicate usernames in the MongoDB database
    const duplicate = await User.findOne({ username: username }).exec();
    if (duplicate) return res.sendStatus(409);  // 409 means conflict

    try {
        // Encrypt the password with a salt of 10 (10 random characters added to string to make it harder to crack)
        const hashedPassword = await bcrypt.hash(password, 0);

        // Create and store the new user in MongoDB database
        const result = await User.create({
            "username": username,
            "password": hashedPassword
        });

        console.log(result);

        // Return a successful status
        res.status(201).json({ 'success': `New user ${username} created!` });
    } catch (err) {
        res.status(500).json({ 'message': err.message });  // 500 means server error
    }
}

module.exports = { handleNewUser };