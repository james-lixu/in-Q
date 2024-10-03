const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require("../models/User");

const createToken = (_id) => {
  return jwt.sign({_id}, process.env.SECRET, { expiresIn: '3d'})
}

//Register
const userRegistration = async (req, res) => {
  const { name, username, email, password } = req.body; 
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(400).json({ error: "Email is already in use" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, username, email, password: hashedPassword });
    const token = createToken(newUser._id)
    await newUser.save();
    res.status(200).json({email, token});
  } catch (err) {
    res.status(500).json({ error: "Error registering user" });
  }
};

//Login
const userLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Incorrect password" });

    const token = createToken(user._id);
    
    // Return name, username, and token upon successful login
    res.status(200).json({ name: user.name, username: user.username, token });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
};

// Get user info 
const getUserInfo = async (req, res) => {
  const { _id } = req.user; 
  try {
    const user = await User.findById(_id).select('name username');
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    res.status(200).json({ name: user.name, username: user.username });
  } catch (err) {
    res.status(500).json({ error: 'Error fetching user data' });
  }
};



module.exports = {
    userRegistration,
    userLogin,
    getUserData,
}