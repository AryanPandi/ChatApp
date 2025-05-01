const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { verifyJWTToken } = require('../services/authService');

exports.authCheck = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized- No token Provided." });
        }
        const decoded = verifyJWTToken(token);
        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized- Invalid Token." });
        }
        const user = await User.findById(decoded._id).select('-user_password');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        req.user = user;
        next();

    } catch (err) {
        console.log("error in the authCheck Middleware :" + err.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};