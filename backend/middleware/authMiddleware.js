const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            // Mock verification for now, or use actual JWT if secret is set
            // const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // For prototype, just check if token exists and is "mock-jwt-token" or valid format
            if (token === 'mock-jwt-token' || token.length > 10) {
                // req.user = ... 
                next();
            } else {
                throw new Error('Not authorized');
            }
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = { protect };
