const User = require("../models/userModel");
const {
    passwordValidator,
    generateHasedPassword,
    generateJWTToken,
    compareHasedPassword,
    cloudinary,
} = require("../services/authService");

exports.singUpUser = async (req, res) => {
    const { user_name, user_email, user_password } = req.body;
    try {
        if (!user_name || !user_email || !user_password) {
            return res.status(400).json({ message: "Invalid User data." });
        }
        const user = await User.findOne({ user_email });
        if (user) {
            return res.status(400).json({ message: "Email already exists." });
        }
        const validPassword = passwordValidator(user_password);
        if (!validPassword.valid) {
            return res
                .status(400)
                .json({ message: validPassword.message, passwordValid: false });
        }
        const hasedPassword = await generateHasedPassword(user_password);

        const newUser = new User({
            user_name,
            user_email,
            user_password: hasedPassword,
        });
        if (newUser) {
            const jwtPayload = {
                _id: newUser._id,
                user_name,
                user_email,
                user_password,
            };
            generateJWTToken(jwtPayload, res);
            await newUser.save();
            newUser.user_password = undefined;
            return res
                .status(201)
                .json({ user: newUser, message: "User is successfully created." });
        } else {
            return res.status(400).json({ message: "Invalid user data given." });
        }
    } catch (err) {
        console.log("Error in signup Process:", err.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.logoutUser = (req, res) => {
    try {
        res.cookie("token", "", { maxAge: 0 });
        return res.status(201).json({ message: "Logout successful" });
    } catch (err) {
        console.log("Error while logout: ", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ message: "Invalid user data given." });
        }
        const user = await User.findOne({ user_email: email });
        if (!user) {
            return res.status(404).json({ message: "Invalid credentials." });
        }
        const match = await compareHasedPassword(password, user.user_password);
        if (!match) {
            return res.status(401).json({ message: "Invalid credentials." });
        }
        const jwtPayload = {
            _id: user._id,
            user_name: user.user_name,
            user_email: user.user_email,
            user_password: user.user_password,
        };
        generateJWTToken(jwtPayload, res);
        user.user_password = undefined;
        return res.status(201).json({ message: "Login successful", user: user });
    } catch (err) {
        console.log("Error while Login: ", err);
        return res.status(500).json({ message: "Internal Server error." });
    }
};

exports.updateProfilePic = async (req, res) => {
    try {
        const { profilePic } = req.body;
        if (!profilePic) {
            res.status(400).json({ message: "Profile pic is reuqired." });
        }
        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const userId = req.user._id;
        const updateUser = await User.findByIdAndUpdate(
            { _id: userId },
            { user_profilePic: uploadResponse.secure_url },
            { new: true }
        );
    } catch (err) {
        console.log("Error while uploading pic to cloudinary: ", err);
        return res.status(500).json({ message: "Internal Server error." });
    }
};

exports.getUser = (req, res) => {
    try {
        return res
            .status(200)
            .json({ message: "User is authenticated", user: req.user });
    } catch (e) {
        console.log("Error in getting user controller: ", err);
        return res.status(500).json({ message: "Internal Server error." });
    }
};