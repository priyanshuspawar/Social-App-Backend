const mongoose = require("mongoose");
const Posts = require("../models/Posts");
const Users = require("../models/Users");

const postUpload = async (req, res, next) => {
  try {
    const {
      userId,
      firstName,
      lastName,
      location,
      description,
      picturePath,
      userPicturePath,
      likes,
      comments,
    } = req.body;
    if (!userId || !firstName || !lastName || !picturePath || !userPicturePath)
      return res.status(400).json({ message: "All fields are required" });
    const user = await Users.findById(userId).lean().exec();
    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }
    const newPost = await Posts.create({
      userId,
      firstName,
      lastName,
      location,
      description,
      picturePath,
      userPicturePath,
      likes,
      comments,
    });
    if (!newPost) return res.status(400).json({ message: "Post not created" });
    res.status(201).json({ message: "Post created successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getFeedPosts = async (req, res) => {
  try {
    const feed = await Posts.find().sort({ createdAt: 1 }).lean().exec();
    res.status(200).json(feed);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ message: "userId required" });
    }
    const posts = await Posts.find({ userId: userId })
      .sort({ createdAt: 1 })
      .lean()
      .exec();
    res.status(200).json(posts);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    if (!id || !userId)
      return res
        .status(400)
        .json({ message: "Id and userid are required to update likes" });
    const post = await Posts.findById(id).exec();
    const isLiked = post.likes.get(userId);
    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }
    const updatedPost = await Posts.findById(id).exec();
    updatedPost.likes = post.likes;
    await updatedPost.save();
    if (!updatedPost)
      return res.status(400).json({ message: "Not updated likes" });
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { postUpload, getFeedPosts, getUserPosts,likePost };
