const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '30d',
    });
};

const registerUser = async (req, res) => {
    const { username, password } = req.body;

    const userExists = User.findByUsername(username);

    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const user = User.create({ username, password });

    if (user) {
        res.status(201).json({
            _id: user.id,
            username: user.username,
            token: generateToken(user.id),
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

const authUser = async (req, res) => {
    const { username, password } = req.body;
    const user = User.findByUsername(username);

    if (user && user.password === password) {
        res.json({
            _id: user.id,
            username: user.username,
            token: generateToken(user.id),
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
};

module.exports = { registerUser, authUser };
