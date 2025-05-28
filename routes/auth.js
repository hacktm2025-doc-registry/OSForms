const express = require("express");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const passport = require("passport");
const nodemailer = require("nodemailer");
const User = require("../models/user.model");
const router = express.Router();
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET; // Use env var in real apps

// Signup
router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }
    // Check if email is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    // Check if password is strong enough
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const randomString = crypto.randomBytes(16).toString("hex");
    const newUser = new User({
      email: email,
      password: password,
      emailVerificationToken: randomString,
    });
    await newUser.save();

    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: process.env.MAIL_EMAIL,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: '"Dev Tester" <dev@example.com>',
      to: "user@example.com",
      subject: "Confirm your email",
      text: `Please confirm your email by clicking the link: http://localhost:3000/confirm?token=${randomString}`,
    };

    await transporter.sendMail(mailOptions, (error, info) => {
      if (error) return res.status(500).json({ message: "Server error" });
      console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
    });

    res.json({
      message: "User registered",
      userId: newUser._id,
      emailVerificationToken: randomString,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Signin
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    // const isMatch = await user.comparePassword(password);
    const isMatch = password === user.password; // Simplified for demo; use bcrypt in production
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    if (!user.emailVerified) {
      return res.status(403).json({
        message:
          "Email not verified. Please check your email for verification link.",
      });
    }
    const payload = { id: user.id, email: user.email };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

    res.json({ token: `Bearer ${token}` });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
