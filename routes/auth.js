const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const passport = require("passport");
const nodemailer = require("nodemailer");
const User = require("../models/user.model");
const AdminToken = require("../models/adminTokens.model"); // Assuming adminTokens.model.js is in the same directory
const router = express.Router();
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET; // Use env var in real apps

router.post("/login", async (req, res, next) => {
  let {role } = req.body;
  if (!role) {
    return res.status(400).json({ message: "Role is required" });
  }
  try {
    const user = await User.findOne({ role: role });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const payload = { id: user.id, email: user.email, role: user.role };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
    res.json({ token: `Bearer ${token}`, msg:"ok", user:user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/permissions", async (req, res, next) => {
  let { role } = req.body;
  if (!role) {
    return res.status(400).json({ message: "Role is required" });
  }
  try {
    const user = await User.findOne({ role: role });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ msg:"ok", permissions:user.permissions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


// // Signup
// router.post("/signup", async (req, res) => {
//   try {
//     const { email, password, adminToken } = req.body;
//     if (!email || !password) {
//       return res
//         .status(400)
//         .json({ message: "Email and password are required" });
//     }
//     // Check if email is valid
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       return res.status(400).json({ message: "Invalid email format" });
//     }
//     // Check if password is strong enough
//     if (password.length < 6) {
//       return res
//         .status(400)
//         .json({ message: "Password must be at least 6 characters long" });
//     }
//     const userExists = await User.findOne({ email });
//     if (userExists)
//       return res.status(400).json({ message: "User already exists" });

//     let isAdmin = false;
//     let adminTokenDoc_outside = null;
//     if (adminToken) {
//       const adminTokenDoc = await AdminToken.findOne({
//         token: adminToken,
//       });
//       if (adminTokenDoc) {
//         isAdmin = true;
//         adminTokenDoc_outside = adminTokenDoc; // Store the token doc for later use
//       } else {
//         return res.status(403).json({ message: "Invalid admin token" });
//       }
//     }

//     const randomString = crypto.randomBytes(16).toString("hex");
//     const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
//     const newUser = new User({
//       email: email,
//       password: hashedPassword,
//       emailVerificationToken: randomString,
//       role: isAdmin ? "admin" : "user", // Assuming role field exists in User model
//       emailVerified: false, // Default to false until email is confirmed
//       createdAt: new Date(),
//     });
//     await newUser.save();
//     if (isAdmin) {
//       // If the user is an admin, delete the admin token
//       await AdminToken.updateOne(
//         { _id: adminTokenDoc_outside._id },
//         { $set: { used: true, userId: newUser._id } }
//       );
//     }

//     const transporter = nodemailer.createTransport({
//       host: "smtp.ethereal.email",
//       port: 587,
//       auth: {
//         user: process.env.MAIL_EMAIL,
//         pass: process.env.MAIL_PASSWORD,
//       },
//     });

//     const mailOptions = {
//       from: '"Dev Tester" <dev@example.com>',
//       to: "user@example.com",
//       subject: "Confirm your email",
//       text: `Please confirm your email by clicking the link: http://localhost:3000/confirm?token=${randomString}`,
//     };

//     await transporter.sendMail(mailOptions, (error, info) => {
//       if (error) return res.status(500).json({ message: "Server error" });
//       console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
//     });

//     res.json({
//       message: "User registered",
//       userId: newUser._id,
//       emailVerificationToken: randomString,
//     });
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// Signin
// router.post("/signin", async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email: email });
//     if (!user) return res.status(400).json({ message: "Invalid credentials" });
//     // const isMatch = await user.comparePassword(password);
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch)
//       return res.status(400).json({ message: "Invalid credentials" });

//     if (!user.emailVerified) {
//       return res.status(403).json({
//         message:
//           "Email not verified. Please check your email for verification link.",
//       });
//     }

// const twofactorKey = crypto.randomInt(100000, 1000000).toString();
// const twofactorValidationToken = crypto.randomBytes(16).toString("hex");
// user.twofactorKey = twofactorKey;
// user.twofactorValidationToken = twofactorValidationToken;
// user.twofactorExpires = Date.now() + 30 * 60 * 1000; // Default to 30 minutes from now
// await user.save();
// // const payload = { id: user.id, email: user.email };
// // const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
//  const transporter = nodemailer.createTransport({
//   host: "smtp.ethereal.email",
//   port: 587,
//   auth: {
//     user: process.env.MAIL_EMAIL,
//     pass: process.env.MAIL_PASSWORD,
//   },
// });

// const mailOptions = {
//   from: '"Dev Tester" <dev@example.com>',
//   to: "user@example.com",
//   subject: "Two-Factor Authentication Required",
//   text: `Your Two-Factor code is ${twofactorKey}`,
// };

// await transporter.sendMail(mailOptions, (error, info) => {
//   if (error) return res.status(500).json({ message: "Server error" });
//   console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
// });
// res.json({message: "Two-factor authentication required", validationToken: twofactorValidationToken });
//     const payload = { id: user.id, email: user.email };
//     const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

//     res.json({ token: `Bearer ${token}` });
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // Signin
// router.post("/signin_final", async (req, res) => {
//   try {
//     const { twofactorKey, twofactorValidationToken } = req.body;
//     const user = await User.findOne({ twofactorValidationToken: twofactorValidationToken });
//     if (!user) return res.status(400).json({ message: "Invalid credentials" });
//     // const isMatch = await user.comparePassword(password);
//     if (user.twofactorKey !== twofactorKey) {
//       return res.status(400).json({ message: "Invalid two-factor key" });
//     }
//     if (user.twofactorExpires < Date.now()) {
//       return res.status(400).json({ message: "Two-factor key expired" });
//     }
//     const payload = { id: user.id, email: user.email };
//     const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

//     res.json({ token: `Bearer ${token}` });
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

module.exports = router;
