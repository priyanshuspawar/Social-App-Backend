const express = require('express');
const { getFeedPosts, getUserPosts, likePost } = require('../controller/posts');
const verifyJWT = require('../middleware/authVerify');
const router = express.Router();


router.get("/",verifyJWT,getFeedPosts);

router.get("/:userId",verifyJWT,getUserPosts);

router.patch("/:id/:userId",verifyJWT,likePost);


module.exports = router;