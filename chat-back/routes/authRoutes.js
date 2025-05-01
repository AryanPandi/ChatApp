const express = require('express');
const { loginUser, singUpUser, logoutUser, updateProfilePic, getUser } = require('../controller/authController');
const { authCheck } = require('../middleware/authMiddleware');
const router = express.Router();

router.post("/login", loginUser);
router.post('/logout', logoutUser);
router.post('/sign-up', singUpUser);
router.put('/update-profile-pic', authCheck, updateProfilePic);
router.get('/user', authCheck, getUser);

module.exports = router;