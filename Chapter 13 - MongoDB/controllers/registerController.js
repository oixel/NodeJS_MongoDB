const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (data) { this.users = data }
}

const fsPromises = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');

// Define handler for the new user information we will receive at this register route
const handleNewUser = async (req, res) => {
    const { username, password } = req.body;

    // If username or password is missing, give error
    if (!username || !password) return res.status(400).json({ 'message': 'Username and password are required.' });

    // Check for duplicate usernames in the database
    const duplicate = usersDB.users.find(user => user.username === username);
    if (duplicate) return res.sendStatus(409);  // 409 means conflict

    try {
        // Encrypt the password with a salt of 10 (10 random characters added to string to make it harder to crack)
        const hashedPassword = await bcrypt.hash(password, 0);

        // Stores the new user as a unique object
        const newUser = {
            "username": username,
            "roles": { "User": 2001 },
            "password": hashedPassword
        };
        usersDB.setUsers([...usersDB.users, newUser]);  // Append new user to database

        // Write data as JSON to users databse
        await fsPromises.writeFile(
            path.join(__dirname, '..', 'model', 'users.json'),
            JSON.stringify(usersDB.users)
        );

        // Display the updated data
        console.log(usersDB.users);

        // Return a successful status
        res.status(201).json({ 'success': `New user ${user} created!` });
    } catch (err) {
        res.status(500).json({ 'message': err.message });  // 500 means server error
    }
}

module.exports = { handleNewUser };