const express = require("express");
const passport = require("passport");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const File = require("../models/file.model"); // Assuming file.model.js is in the same directory

const { createUser, getUser } = require("../routes/ckan_api"); // Importing createUser function from ckan_api.js

// Set storage engine for Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(require("os").homedir(), "backend", "uploads");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true }); // recursive handles nested dirs
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

// File filter for PDFs only
const fileFilter = function (req, file, cb) {
  if (file.mimetype === 'application/pdf') {
    cb(null, true); // accept the file
  } else {
    cb(new Error('Only PDF files are allowed!'), false); // reject the file
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

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

// Route: Upload file
router.post("/upload", passport.authenticate("jwt", { session: false }), upload.single("file"), async (req, res) => {

  // Check if file is provided
  let file = await req.file;
  if (!file) return res.status(400).send("No file uploaded.");
  let dbFile = await File.create({
    name: file.filename,
    createdBy: req.user.id, // Assuming req.user is populated by passport
  });
  if (!dbFile) return res.status(500).send("Could not save file info to database.");

  res.json({
    message: "File uploaded successfully!",
    filename: req.file.filename,
    url: `/files/${req.file.filename}`,
  });
});

router.get("/files", passport.authenticate("jwt", { session: false }), (req, res) => {
  const dirPath = path.join(require("os").homedir(), "backend", "uploads");
  fs.readdir(dirPath, (err, files) => {
    if (err) return res.status(500).send("Could not list files.");
    res.json(
      files.map((file) => ({
        name: file,
        url: `/files/${file}`,
      }))
    );
  });
});

router.get("/getUser", passport.authenticate("jwt", { session: false }), async (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).json({ message: "Email and name are required" });
  }
  let result = await getUser(username);
  if (!result) {
    return res.status(404).json({ message: "User not found" });
  }
  console.log("Result from CKAN API:", result);
  return res.json({ user: result });
});

router.post("/createUser", passport.authenticate("jwt", { session: false }), async (req, res) => {
  const { email, name, password, fullname } = req.body;
  if (!email || !name) {
    return res.status(400).json({ message: "Email and name are required" });
  }
  let result = await createUser({ email, name, password, fullname });
  if (!result) {
    return res.status(500).json({ message: "Failed to create user" });
  }
  console.log("Result from CKAN API:", result);
  res.json({ message: "User created successfully" });
});

module.exports = router;
