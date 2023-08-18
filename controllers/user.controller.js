const bcrypt = require('bcrypt');
const User = require('../models/user.schema');
const { tokenGenerator } = require('../utils/common');
const jwt = require('jsonwebtoken')

exports.signup = async (req, res) => {
    try {
        const { userName, email, password } = req.body;

        // Check if the email is already taken
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email is already registered' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const user = new User({ userName, email, password: hashedPassword });
        await user.save();

        // Generate a JWT token
        const token = tokenGenerator({
            userName: user.userName,
            email: user.email,
            userId: user._id,
        });

        // Update new generated JWT token with user data
        const userData = await User.findOneAndUpdate(
            { _id: user._id },
            { accessToken: token },
            { new: true }
        );
        // Response to the client
        return res.status(200).json({
            message: "New user created",
            data: {
                _id: user._id,
                userName: userData.userName,
                email: userData.email,
                accessToken: token,
                role: userData.role,
            },
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'An error occurred' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate new token for the logged-in user
        const token = tokenGenerator({
            name: user.name,
            email: user.email,
            userId: user._id,
        });

        // Update new generated JWT token with user data
        const userData = await User.findOneAndUpdate(
            { _id: user._id },
            { accessToken: token },
            { new: true }
        );

        // Response to the client
        return res.status(200).json({
            message: "Logged-in",
            data: {
                _id: user._id,
                name: userData.name,
                email: userData.email,
                accessToken: token,
                role: userData.role,
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred' });
    }
};

exports.logout = async (req, res) => {
    try {
        const expiredToken = await jwt.sign({}, process.env.JWT_TOKEN_SECRET_KEY, { expiresIn: 0 });
        await User.findOneAndUpdate(
            { _id: req.user.userId },
            { accessToken: expiredToken },
            { new: true }
        );
        res.json({ message: 'Logged out successfully', accessToken: expiredToken });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred' });
    }
}