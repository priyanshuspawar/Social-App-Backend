const express = require('express');
const { getFeedPosts, getUserPosts, likePost,commentPost } = require('../controller/posts');
const verifyJWT = require('../middleware/authVerify');
const router = express.Router();


router.get("/",verifyJWT,getFeedPosts);

router.get("/:userId",verifyJWT,getUserPosts);

router.patch("/:id/:userId",verifyJWT,likePost);

router.patch("/comment/:id/:userId/",verifyJWT,commentPost);


module.exports = router;