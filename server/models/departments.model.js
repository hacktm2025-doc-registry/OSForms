const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  permissionsNeeded: {
    type: [String],
    required: true,
    default: [], // Default to an empty array if no permissions are provided
  },
  workflowProcessStep: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "workflowProcess", // Reference to the workflow process model
    required: false, // Not required, can be null if no workflow process is associated
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the user model
    required: false, // Required field to track who created the department
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: "1h", // Token expires after 1 hour
  },
});
// Export the model
module.exports = mongoose.model("departmens", departmentSchema);
