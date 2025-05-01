const mongoose = require('mongoose');


const userModelSchema = new mongoose.Schema({
    user_name: {
        type: String,
        require: true,
        unique: true,
    },
    user_email: {
        type: String,
        require: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^([a-z0-9]+(?:[.-_][a-z0-9]+)*@[a-z0-9.-]+\.[a-z]{2,})$/, 'Please fill a valid email address'],
    },
    user_password: {
        type: String,
        required: true,
        minlength: 8,
    },
    user_profilePic: {
        type: String,
        default: 'default-profile-pic.jpg',
    },
}, { timestamps: true });


const UserModel = mongoose.model('User', userModelSchema);


module.exports = UserModel;