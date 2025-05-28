const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/user.model');

const router = express.Router();

router.get('/', (req, res) => {
    res.json({ message: 'Welcome to the unprotected route!' });
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

module.exports = router;
