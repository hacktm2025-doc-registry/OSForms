const mongoose = require("mongoose");

const documentsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: false,
  },
  description: {
    type: String,
    required: false,
    default: "", // Default to an empty string if no description is provided
  },
  data: {
    type: Object,
  },
  workflowStepType: {
    type: String,
    required: true,
    default: "initial_submit", // Default to an empty array if no workflow steps are provided
  },
  createdBy: {
    type: String,
    required: true,
  },
  docHistory:{
    type: [],
    default: [], // Default to an empty array if no history is provided
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: "1h", // Token expires after 1 hour
  },
});
// Export the model
module.exports = mongoose.model("documents", documentsSchema);
