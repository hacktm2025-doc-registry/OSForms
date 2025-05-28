const express = require('express');
const User = require('../models/user.model');
const AdminToken = require('../models/adminTokens.model'); // Assuming adminTokens.model.js is in the same directory
const nodemailer = require("nodemailer");

const router = express.Router();

router.get('/', (req, res) => {
    res.json({ message: 'Welcome to the unprotected route!' });
})

router.get('/adminToken', async (req, res) => {
    let found = await AdminToken.findOne({});
    if (!found) {
        return res.status(404).json({ message: 'No admin token found' });
    }
    res.json({ token: found.token });
})

router.get('/confirm', async (req, res) => {
    let { token } = await req.query;
    if (!token) {
        return res.status(400).json({ message: 'Token is required' });
    }
    let found = await User.findOne({ emailVerificationToken: token });
    if (!found) {
        return res.status(404).json({ message: 'Invalid token' });
    }
    found.emailVerified = true;
    found.emailVerificationToken = null;
    await found.save();
    res.json({ message: 'Email was confirmed. Proceed to login!' });
})

router.get('/reset', async (req, res) => {
    let { email } = await req.query;
    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }
    let found = await User.findOne({ email: email });
    if (!found) {
        return res.status(404).json({ message: 'Invalid email' });
    }
    let randomString = require('crypto').randomBytes(16).toString('hex');
    found.resetPasswordToken = randomString;
    found.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await found.save();

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
          text: `Reset your password with the link http://localhost:3000/reset?token=${randomString}`,
        };
    
        await transporter.sendMail(mailOptions, (error, info) => {
          if (error) return res.status(500).json({ message: "Server error" });
          console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
        });

    res.json({ message: 'Reset password confirmed. Email sent!', token: randomString });
})

router.post('/reset', async (req, res) => {
    let { token } = await req.query;
    if (!token) {
        return res.status(400).json({ message: 'Token is required' });
    }
    let { password } = await req.body;
    if (!password) {
        return res.status(400).json({ message: 'Password is required' });
    }
    let found = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
    if (!found) {
        return res.status(404).json({ message: 'Invalid or expired token' });
    }
    found.password = password;
    found.resetPasswordToken = null;
    found.resetPasswordExpires = null;
    await found.save();
    res.json({ message: 'Password was reset successfully!' });
})

module.exports = router;
