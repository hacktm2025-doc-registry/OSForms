const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: { type: String, required: true },
  resetPasswordExpires: { type: Date, default: null },
  resetPasswordToken: {
    type: String,
    default: null,
  },
  emailVerified: { type: Boolean, default: false },
  emailVerificationToken: {
    type: String,
    default: null,
  },
  twofactorKey: {
    type: String,
    default: null,
  },
  twofactorExpires: {
    type: Date,
    default: Date.now() + 30 * 60 * 1000, // Default to 30 minutes from now
  },
  twofactorValidationToken: { type: String, default: null },
  role: {
    type: String,
    default: "user",
  },
  profilePicture: {
    type: String,
    default: "https://example.com/default-profile.png",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Export the model
module.exports = mongoose.model("User", userSchema);
