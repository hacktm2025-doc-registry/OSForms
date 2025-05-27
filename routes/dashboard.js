const express = require("express");
const passport = require("passport");

const router = express.Router();

// Protected dashboard route
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({ message: `Welcome ${req.user.email}! This is your dashboard.` });
  }
);

router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      user: {
        id: req.user._id,
        email: req.user.email,
        name: req.user.name || "No name provided",
        profilePicture: req.user.profilePicture || "No profile picture",
      },
    });
  }
);

module.exports = router;
