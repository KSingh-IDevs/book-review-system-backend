const jwt = require('jsonwebtoken');

exports.tokenGenerator = (data) => {
    try {
        const token = jwt.sign(data, process.env.JWT_TOKEN_SECRET_KEY, { expiresIn: process.env.JWT_TOKEN_EXPIRATION, });

        return token;
    }
    catch (e) {
        console.log(e);
    }
}