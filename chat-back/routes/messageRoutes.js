const express = require('express');
// const {loginUser,singUpUser, logoutUser,updateProfilePic,getUser} =require('../controller/authController');
const { getAllUsers, getMessages, sendMessages } = require('../controller/messageController');
const { authCheck } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/users', authCheck, getAllUsers);
router.get('/user/:receiverId', authCheck, getMessages);
router.post('/send/:id', authCheck, sendMessages);

module.exports = router;