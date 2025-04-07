const jwt = require("jsonwebtoken");
const { JWT_ADMIN_PASSWORD } = require("../config");

// function middleware(password) {
//     return function(req, res, next) {
//         const token = req.headers.token;
//         const decoded = jwt.verify(token, password);

//         if (decoded) {
//             req.userId = decoded.id;
//             next()
//         } else {
//             res.status(403).json({
//                 message: "You are not signed in"
//             })
//         }    
//     }
// }

function adminMiddleware(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                message: "No token provided or invalid token format"
            });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_ADMIN_PASSWORD);

        if (decoded && decoded.adminId) {
            req.userId = decoded.adminId;
            next();
        } else {
            res.status(403).json({
                message: "Invalid token"
            });
        }
    } catch (error) {
        res.status(403).json({
            message: "Authentication failed"
        });
    }
}

module.exports = {
    adminMiddleware
}