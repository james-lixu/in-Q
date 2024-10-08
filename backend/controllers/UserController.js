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
    const newUser = new User({ name, username, email, password: hashedPassword, followers: [], following: [], });
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
  const { username } = req.query; 

  try {
    let user;

    if (username) {
      user = await User.findOne({ username }).select('name username followers following');
    } else {
      user = await User.findById(_id).select('name username followers following');
    }

    if (!user) return res.status(404).json({ error: 'User not found' });

    const followerCount = user.followers.length;
    const followingCount = user.following.length;

    res.status(200).json({
      name: user.name,
      username: user.username,
      followerCount, 
      followingCount
    });
  } catch (err) {
    res.status(500).json({ error: 'Error fetching user data' });
  }
};

// Log out
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

  try {
    const currentUser = await User.findById(req.user._id); 
    if (!currentUser) {
      return res.status(404).json({ error: 'Current user not found' });
    }

    // Find the user to follow by username
    const userToFollow = await User.findOne({ username });
    if (!userToFollow) {
      return res.status(404).json({ error: 'User to follow not found' });
    }

    // Case self-follow
    if (currentUser._id.equals(userToFollow._id)) {
      return res.status(400).json({ error: 'Cannot follow your own account' });
    }

    // Add current user's ID to the followers array of the user to follow
    userToFollow.followers.addToSet(currentUser._id);
    await userToFollow.save();

    // Add the followed user's ID to the following array of the current user
    currentUser.following.addToSet(userToFollow._id);
    await currentUser.save();

    res.status(200).json({ message: 'User followed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Unfollow a user
const unfollowUser = async (req, res) => {
  const { username } = req.body;

  try {
    const currentUser = await User.findById(req.user._id); 
    if (!currentUser) {
      return res.status(404).json({ error: 'Current user not found' });
    }

    // Find the user to unfollow by username
    const userToUnfollow = await User.findOne({ username });
    if (!userToUnfollow) {
      return res.status(404).json({ error: 'User to unfollow not found' });
    }

    // Remove the current user's ID from the followers array of the user to unfollow
    userToUnfollow.followers.pull(currentUser._id);
    await userToUnfollow.save();

    // Remove the unfollowed user's ID from the following array of the current user
    currentUser.following.pull(userToUnfollow._id);
    await currentUser.save();

    res.status(200).json({ message: 'User unfollowed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
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

// Check if two users are following each other (friends)
const checkFriendship = async (req, res) => {
  const { username } = req.params;
  const currentUser = req.user; 

  try {
    const profileUser = await User.findOne({ username });
    if (!profileUser) return res.status(404).json({ error: 'User not found' });

    // Check if they follow each other
    const isFriend = profileUser.followers.includes(currentUser._id) && currentUser.followers.includes(profileUser._id);

    res.status(200).json({ isFriend });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Get friends list
const getFriendsList = async (req, res) => {
  const { _id } = req.user;
  try {
    console.log(`Fetching friends list for user ID: ${_id}`); 

    const user = await User.findById(_id).populate({
      path: 'following',
      select: 'name username followers',
      model: 'User',
      populate: {
        path: 'followers',
        select: '_id',
      },
    });

    if (!user) {
      console.log('User not found');
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('Following users:', user.following);

    const friends = user.following.filter(friend => {
      return friend.followers.some(follower => follower._id.equals(_id));
    });
    res.status(200).json(friends);
  } catch (err) {
    console.error('Error fetching friends:', err); 
    res.status(500).json({ error: 'Error fetching friends list' });
  }
};

// Upload profile image
const uploadProfileImage = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);  
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    user.profileImage = req.file.path;
    await user.save();

    res.status(200).json({
      message: 'Profile image uploaded successfully',
      profileImage: user.profileImage  // Send back the URL to the frontend
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to upload profile image' });
  }
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
    checkFriendship,
    getFriendsList,
    uploadProfileImage,
}