const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require("../models/User");

const createToken = (user) => {
  return jwt.sign(
    { _id: user._id, username: user.username }, 
    process.env.SECRET,
    { expiresIn: '3d' }
  );
};

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
    await newUser.save();
    
    const token = createToken(newUser);  
    res.status(200).json({ email: newUser.email, token });
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

    const token = createToken(user); 
    
    res.status(200).json({ name: user.name, username: user.username, token });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
};

// Get user info 
const userInfo = async (req, res) => {
  const { _id } = req.user; 
  try {
    const user = await User.findById(_id).select('name username');
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    res.status(200).json({ name: user.name, username: user.username });
  } catch (err) {
    res.status(500).json({ error: 'Error fetching user data' });
  }
};

const userLogout = (req, res) => {
  res.status(200).json({ message: "Logout successful" });
};


// Get user by username
const getUsername = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username }); 
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Follow a user
const followUser = async (req, res) => {
  const { username } = req.body;
  const currentUser = req.user; 
  const userToFollow = await User.findOne({ username });
  if (!userToFollow) return res.status(404).json({ error: 'User not found' });

  userToFollow.followers.addToSet(currentUser._id);
  await userToFollow.save();

  currentUser.following.addToSet(userToFollow._id);
  await currentUser.save();

  res.status(200).json({ message: 'User followed successfully' });
  };

// Unfollow a user
const unfollowUser = async (req, res) => {
  const { username } = req.body;
  const currentUser = req.user;

  const userToUnfollow = await User.findOne({ username });
  if (!userToUnfollow) return res.status(404).json({ error: 'User not found' });

  userToUnfollow.followers.pull(currentUser._id);
  await userToUnfollow.save();

  currentUser.following.pull(userToUnfollow._id);
  await currentUser.save();

  res.status(200).json({ message: 'User unfollowed successfully' });
};

// Check if following
const checkFollowing = async (req, res) => {
  const { username } = req.params;
  const currentUser = req.user; 

  const profileUser = await User.findOne({ username });
  if (!profileUser) return res.status(404).json({ error: 'User not found' });

  const isFollowing = profileUser.followers.includes(currentUser._id);
  res.status(200).json({ isFollowing });
};

module.exports = {
    userRegistration,
    userLogin,
    userLogout,
    userInfo,
    followUser,
    unfollowUser,
    getUsername,
    checkFollowing,
}