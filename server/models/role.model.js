const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["user", "sef_dep", "sec_prim", "primar", "god"], // Example role types
  },
  permissions: {
    type: [String],
    required: true,
    default: [], // Default to an empty array if no permissions are provided
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: "1h", // Token expires after 1 hour
  },
});
// Export the model
module.exports = mongoose.model("role", roleSchema);
