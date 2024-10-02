const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require("../models/User");

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
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error registering user" });
  }
};

//Login
const userLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    // If the user exists and the password is correct
    res.status(200).json({ message: "Login successful", user: user.username });
  } catch (err) {
    res.status(500).json({ error: "Error logging in" });
  }
};

module.exports = {
    userRegistration,
    userLogin,
}