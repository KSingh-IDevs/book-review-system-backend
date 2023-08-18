const jwt = require('jsonwebtoken');
const User = require('../models/user.schema');

module.exports = async (req, res, next) => {
    const token = req.headers['Authorization'] || req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ message: 'Authorization token missing' });
    }

    try {
        jwt.verify(token, process.env.JWT_TOKEN_SECRET_KEY, async (err, decodedToken) => {
            if (err) {
                return res.status(403).json({ message: 'Invalid token' });
            }

            const result = await User.findOne({ accessToken: token });
            if (!result) {
                return res.status(401).json({ message: "User session expired." });
            }
            req.user = decodedToken;
            next();
        });
    } catch (error) {
        return res.status(500).json({ message: 'An error occurred' });
    }
};
