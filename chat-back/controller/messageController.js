const User = require("../models/userModel");
const Message = require("../models/messageModel");
const { cloudinary } = require("../services/authService");

exports.getAllUsers = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const restUsers = await User.find({ _id: { $ne: loggedInUserId } }).select(
            "-user_password"
        );

        return res
            .status(200)
            .json({ message: "All user except logged in user", userList: restUsers });

    } catch (e) {
        console.log("Error while getting rest users: ", err);
        return res.status(500).json({ message: "Internal Server error." });
    }
};

exports.getMessages = async (req, res) => {
    try {
        const { receiverId: userToChatId } = req.params;
        const myId = req.user._id;
        const messages = await Message.find({
            $or: [{ senderId: myId, receiverId: userToChatId }
                , { senderId: userToChatId, receiverId: myId },
            ],
        });

        return res.status(200).json({ message: "All message between users are provided", chats: messages });

    } catch (e) {
        console.log("Error while getting chat messages: ", err);
        return res.status(500).json({ message: "Internal Server error." });
    }
};

exports.sendMessages = async (req, res) => {
    try {
        const { id: receiverId } = req.params;
        const { text, image } = req.body;
        const senderId = req.user._id;
        var imageURL;
        if (image) {
            const uploadImage = await cloudinary.uploader.upload(image);
            imageURL = uploadImage.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageURL,
        });
        await newMessage.save();
        //socket.emit here

        return res.status(201).json({ message: "message added", chats: newMessage });

    } catch (e) {
        console.log("Error while sending messages: ", err);
        return res.status(500).json({ message: "Internal Server error." });
    }
}