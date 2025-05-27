const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/user.model');

const router = express.Router();
const JWT_SECRET = 'your_jwt_secret'; // Use env var in real apps

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'email taken' });

    const newUser = new User({ email, password });
    await newUser.save();
    res.json({ message: 'User registered' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Signin
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    // const isMatch = await user.comparePassword(password);
    const isMatch = password === user.password; // Simplified for demo; use bcrypt in production
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    console.log('User found:', isMatch);

    const payload = { id: user.id, email: user.email };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });

    res.json({ token: `Bearer ${token}` });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
