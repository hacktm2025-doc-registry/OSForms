const mongoose = require("mongoose");

const documentTemplateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  permissions: {
    type: [String],
    required: true,
    default: [], // Default to an empty array if no permissions are provided
  },
  forms: {
    type: [String],
    required: true,
    default: [], // Default to an empty array if no permissions are provided
  },
  data:{
    type: Object
  },
  workflowSteps: {
    type: [String],
    required: true,
    default: [], // Default to an empty array if no workflow steps are provided
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: "1h", // Token expires after 1 hour
  },
});
// Export the model
module.exports = mongoose.model("documentTemplates", documentTemplateSchema);
