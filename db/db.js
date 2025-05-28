require('dotenv').config();
const mongoose = require("mongoose");
const User = require("../models/user.model"); // Assuming user.model.js is in the same directory
const AdminTokens = require("../models/adminTokens.model"); // Assuming adminTokens.model.js is in the same directory

const uri = process.env.MONGODB_URI;

const connect = async () => {
  try {
    await mongoose.connect(uri);
    console.log("✅ Connected to MongoDB Atlas");

    const found = await User.findOne({ email: "TEST_ADMIN@admin.com" });
    console.log("✅ User found:", found);
    // Create and save a user
    if (!found) {
      console.log("❗ User not found, creating a new one.");
      const newUser = new User({
        name: "TEST_ROB",
        email: "TEST_ADMIN@admin.com",
        password: "TEST_ADMIN",
        role: "admin",
        emailVerified: true, // Assuming email is verified for this test user
        emailVerificationToken: null, // No token needed for this test user
        createdAt: new Date(),
      });
      await newUser.save();
      console.log("✅ User saved:", newUser);
    }

    const adminTokens = await AdminTokens.countDocuments();
    console.log("✅ Admin tokens count:", adminTokens);
    if (adminTokens === 0) {
      let randomString = require('crypto').randomBytes(16).toString('hex');
      console.log("❗ No admin tokens found, creating a new one.");
      const newAdminToken = new AdminTokens({
        token: randomString,
      });
      await newAdminToken.save();
      console.log("✅ Admin token saved:", newAdminToken);
    }

    console.log("✅ DB up an running!");
  } catch (err) {
    console.error("❌ Connection error:", err);
  }
};

const disconnect = async () => {
    try {
        await mongoose.disconnect();
        console.log("✅ Disconnected from MongoDB Atlas");
    } catch (err) {
        console.error("❌ Disconnection error:", err);
    }
}

module.exports = {connect, disconnect};
