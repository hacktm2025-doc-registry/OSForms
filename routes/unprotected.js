const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/user.model');

const router = express.Router();

router.get('/', (req, res) => {
    res.json({ message: 'Welcome to the unprotected route!' });
})

module.exports = router;
