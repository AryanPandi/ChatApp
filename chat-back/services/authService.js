const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.passwordValidator = (password) => {
    try {
        const minPasswordLength = parseInt(process.env.MIN_PASSWORD_LENGTH, 10);
        if (password.length < minPasswordLength) {
            return {
                valid: false,
                message:
                    "Password should be atleast " + minPasswordLength + " characters long.",
            };
        }
        const passwordComplexity =
            /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
        if (!passwordComplexity.test(password)) {
            return {
                valid: false,
                message:
                    "Password must contain at least one uppercase letter, one number, and one special character.",
            };
        }
        return { valid: true };
    } catch (err) {
        console.log("Error while validating the password: ", err);
    }
};

exports.generateHasedPassword = async (password) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hasedPassword = await bcrypt.hash(password, salt);
        return hasedPassword;
    } catch (err) {
        throw new Error("Error while hashing the password.");
    }
};

exports.generateJWTToken = (payload, res) => {
    try {
        const jwtToken = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXP,
        });
        res.cookie('token', jwtToken, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: false,
        });
        return jwtToken;
    } catch (err) {
        console.log("Error while generating JWT TOken: ", err);
    }
};

exports.compareHasedPassword = async (password, userPassword) => {
    try {
        const match = await bcrypt.compare(password, userPassword);
        return match;
    }
    catch (e) {
        console.log("Error while comparing password: ", e);
    }
};

exports.verifyJWTToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded;
    } catch (err) {
        console.log("Error while verifying token: ", err);
    }
};