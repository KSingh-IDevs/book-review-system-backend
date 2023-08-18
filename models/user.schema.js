const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        email: { type: String, required: true, unique: true },
        userName: { type: String, required: true, },
        password: { type: String, required: true },
        role: { type: String, enum: ['USER', 'ADMIN'], default: 'USER' },
        accessToken: { type: String, trim: true, default: "", },
    },
    { timestamps: true }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
