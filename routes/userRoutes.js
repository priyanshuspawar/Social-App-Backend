const express = require('express');
const { getUser, getUserFriends, addRemoveFriend } = require('../controller/users');
const verifyJWT = require('../middleware/authVerify');
const router = express.Router();



router.get("/:id",verifyJWT,getUser);


router.get("/:id/friends",verifyJWT,getUserFriends);

router.patch("/:id/:friendId",verifyJWT,addRemoveFriend);


module.exports = router;