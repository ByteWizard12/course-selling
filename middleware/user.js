const jwt = require("jsonwebtoken");
const { JWT_USER_PASSWORD } = require("../config");

function userMiddleware(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                message: "No token provided or invalid token format"
            });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_USER_PASSWORD);

        if (decoded && decoded.userId) {
            req.userId = decoded.userId;
            next();
        } else {
            res.status(401).json({
                message: "Invalid token"
            });
        }
    } catch (error) {
        res.status(401).json({
            message: "Authentication failed",
            error: error.message
        });
    }
}

module.exports = {
    userMiddleware
};