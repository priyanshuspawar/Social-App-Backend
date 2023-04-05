const bcrypt = require("bcrypt");
const Users = require("../models/Users");
const jwt = require("jsonwebtoken");

function capitalizeFirstLetter(str) {

  const capitalized = str.charAt(0).toUpperCase() + str.slice(1);

  return capitalized;
}




const register = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      friends,
      occupation,
      location,
      picturePath,
      viewedProfile,
      impressions,
    } = req.body;
    if (!firstName || !lastName || !email || !password || !picturePath) {
      return res
        .status(400)
        .json({ message: "Please enter all required fields" });
    }

    const duplicate = await Users.findOne({ email: email });

    if (duplicate) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPwd = await bcrypt.hash(password, 10);

    const newUser = await Users.create({
      firstName:capitalizeFirstLetter(firstName),
      lastName:capitalizeFirstLetter(lastName),
      email:email.toLowerCase(),
      password: hashedPwd,
      friends,
      occupation:capitalizeFirstLetter(occupation),
      location:capitalizeFirstLetter(location),
      picturePath,
      viewedProfile: Math.random() * 10,
      impressions: Math.random() * 10,
    });

    if (newUser) {
      return res.status(201).json({ message: `User created ${firstName}` });
    } else {
      return res.status(409).json({ message: "Invalid Request" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
    console.log(err.message);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields must be provided" });
    }
    const user = await Users.findOne({ email: email }).lean().exec();
    if (!user) {
      return res.status(400).json({ message: "User Not Found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid Password. " });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    delete user.password;

    res.status(200).json({ token, user });
  } catch (error) {
    console.log(error.message);
  }
};
module.exports = { register, login };
