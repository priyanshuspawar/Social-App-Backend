const Users = require("../models/Users");

// get particular user details using id
const getUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await Users.findById(id).select("-password").lean().exec();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ ...user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await Users.findById(id).select("-password").lean().exec();
    if (!user) return res.status(400);
    const friends = await Promise.all(
      user.friends.map((id) => {
        return Users.findById(id).select("-password").exec();
      })
    );
    res.status(200).json(friends);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const user = await Users.findById(id).select("-password").exec();
    const friend = await Users.findById(friendId).select("-password").exec();
    if (!user || !friend) {
      res.status(400).json({ message: "User not found" });
    }
    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter((id) => id != friendId);
      friend.friends = friend.friends.filter((id) => id != id);
    } else {
      user.friends.push(friendId);
      friend.friends.push(id);
    }
    await user.save();
    await friend.save();

    const friendsArray = await Promise.all(
      user.friends.map((id) => Users.findById(id).select("-password").exec())
    );

    res.status(200).json(friendsArray);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
module.exports = { getUser, getUserFriends, addRemoveFriend };
