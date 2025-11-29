const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Mock Data Store
const users = [];
const builds = [];

// Routes
app.get('/', (req, res) => {
    res.send('BattleStation API Online');
});

// Auth Routes
app.post('/api/auth/signup', (req, res) => {
    const { username, password } = req.body;
    if (users.find(u => u.username === username)) {
        return res.status(400).json({ message: 'User already exists' });
    }
    const user = { id: Date.now(), username, password }; // In real app, hash password
    users.push(user);
    res.status(201).json({ message: 'User created', user: { id: user.id, username: user.username } });
});

app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    res.json({ message: 'Login successful', token: 'mock-jwt-token', user: { id: user.id, username: user.username } });
});

const components = require('./data/components.json');

// Component Catalog Route
app.get('/api/components', (req, res) => {
    const { category } = req.query;
    if (category) {
        return res.json(components.filter(c => c.type === category));
    }
    res.json(components);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
