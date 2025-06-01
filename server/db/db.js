require("dotenv").config();
const mongoose = require("mongoose");

const User = require("../models/user.model"); // Assuming user.model.js is in the same directory
const AdminTokens = require("../models/adminTokens.model"); // Assuming adminTokens.model.js is in the same directory
const Role = require("../models/role.model"); // Assuming role.model.js is in the same directory
const DocumentTemplates = require("../models/documentTemplates.model"); // Assuming documentTemplates.model.js is in the same directory
const Department = require("../models/departments.model"); // Assuming departments.model.js is in the same directory
const WorkflowProcessEntity = require("../models/workflowProcessEntity.model"); // Assuming workflowProcess.model.js is in the same directory
const Document = require("../models/documents.model"); // Assuming documents.model.js is in the same directory

const default_users = require("./default_users.json"); // Assuming default_users.json is in the same directory
const default_roles = require("./default_roles.json"); // Assuming default_roles.json is in the same directory
const default_workflow_steps_definition = require("./default_workflow_steps_definition.json"); // Assuming default_workflow_steps_definition.json is in the same directory
const default_documents = require("./default_documents.json"); // Assuming default_documents.json is in the same directory
const petitii_form = require("../forms/petitii.json");
const uri = "mongodb://"+ process.env.MONGODB_USER + ":" + process.env.MONGODB_PASSWORD + "@" + process.env.MONGODB_HOST + ":" + process.env.MONGODB_PORT + "/?authSource=admin&&directConnection=true"; // Example:


const create_default_workflow = async () => {
  try {
    const workflowExists = await WorkflowProcessEntity.countDocuments();
    if (workflowExists > 0) {
      console.log("✅ Default workflow already exists, skipping creation.");
      return;
    }
    console.log("❗ No workflow found, creating default workflow.");
    const workflowSteps = default_workflow_steps_definition.map((step) => ({
      step_name: step.step_name,
      step_type: step.step_type || "standard", // Default to 'standard' if not specified
      next_steps: step.next_steps || null, // Default to null if no next step is provided
      proceed_to_next_step_event: step.proceed_to_next_step_event || "",
      previous_step: step.previous_step || null, // Default to null if no previous step is provided
      description: step.description || "",
      roles: step.roles || [], // Ensure roles is an array
    }));

    const defaultWorkflow = await WorkflowProcessEntity.insertMany(
      workflowSteps
    );
    console.log("✅ Default workflow created:", defaultWorkflow);
  } catch (err) {
    console.error("❌ Error creating default workflow:", err);
  }
};

const create_default_document = async () => {
  try {
    const documentExists = await Document.countDocuments();
    if (documentExists > 0) {
      console.log(
        "✅ Default document already exist, skipping creation."
      );
      return;
    }
    console.log(
      "❗ No document found, creating default document."
    );
    const defaultDocuments = default_documents.map((doc) => ({
      name: doc.name,
      description: doc.description || "", // Default to an empty string if no description is provided
      data: doc.data || {}, // Defa4ult to an empty object if no data is provided
      createdAt: doc.createdAt || Date.now(), // Default to current date if not provided
      workflowStepType: doc.workflowStepType || [], // Ensure permissions is an array
      createdBy: doc.createdBy || "system", // Default to 'system' if no creator is specified
    }));
    const defaultDocumentsInsert = await Document.insertMany(defaultDocuments);
    console.log(
      "✅ Default document created:",
      defaultDocumentsInsert
    );
  } catch (err) {
    console.error("❌ Error creating default document:", err);
  }
};

const create_default_document_templates = async () => {
  try {
    const documentExists = await DocumentTemplates.countDocuments();
    if (documentExists > 0) {
      console.log(
        "✅ Default document templates already exist, skipping creation."
      );
      return;
    }
    console.log(
      "❗ No document templates found, creating default document templates."
    );
    const defaultDocumentsInsert = await DocumentTemplates.insertOne({
      name: "Petitii",
      permissions: ["read", "write", "delete"], // Default permissions
      forms: "Petitii", // Assuming petitii_form is an array of form definitions
      data: petitii_form, // Default to an empty object if no data is provided
      workflowSteps: [], // Default to an empty array if no workflow steps are provided
      createdAt: Date.now(), // Set the current date as createdAt
    });
    console.log(
      "✅ Default document templates created:",
      defaultDocumentsInsert
    );
  } catch (err) {
    console.error("❌ Error creating default document templates:", err);
  }
};

const connect = async () => {
  try {
    console.log("🔗 Connecting to MongoDB Atlas... " , uri);
    await mongoose.connect(uri);
    console.log("✅ Connected to MongoDB!!!");

    const Roles = await Role.countDocuments();
    if (Roles === 0) {
      console.log("❗ No roles found, creating default roles.");
      const roles = default_roles.map((role) => ({
        ...role,
        permissions: role.permissions || [],
        type: role.type, // Ensure permissions is an array
      }));
      await Role.insertMany(roles);
      console.log("✅ Default roles created:", roles);
    }

    const Users = await User.countDocuments();
    if (Users === 0) {
      console.log("❗ No users found, creating default users.");
      const users = default_users.map((user) => ({
        ...user,
        email: user.email.toLowerCase(), // Ensure email is lowercase
        role: user.role || "user",
        name: user.name // Default to 'user' if no role is specified
      }));
      await User.insertMany(users);
      console.log("✅ Default users created:", users);
    }

    await create_default_workflow();
    await create_default_document();
    await create_default_document_templates();

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
};

module.exports = { connect, disconnect };
