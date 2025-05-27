require('dotenv').config();
const mongoose = require("mongoose");
const User = require("./user.model"); // Assuming user.model.js is in the same directory

const uri = process.env.MONGODB_URI;

const connect = async () => {
  try {
    await mongoose.connect(uri);
    console.log("✅ Connected to MongoDB Atlas");

    const found = await User.findOne({ email: "TEST_ROB" });
    console.log("✅ User found:", found);
    // Create and save a user
    if (!found) {
      console.log("❗ User not found, creating a new one.");
      const newUser = new User({
        name: "TEST_ROB",
        email: "TEST_ROB",
        age: 25,
      });
      await newUser.save();
      console.log("✅ User saved:", newUser);
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
