const express = require("express");
const passport = require("passport");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const File = require("../models/file.model"); // Assuming file.model.js is in the same directory

// utils
const { send_email } = require("../utils/helpers"); // Assuming helpers.js is in the utils directory
// models
const User = require("../models/user.model"); // Assuming user.model.js is in the same directory
const Document = require("../models/documents.model"); // Assuming documents.model.js is in the same directory
const WorkflowEntity = require("../models/workflowProcessEntity.model"); // Assuming workflowProcessEntity.model.js is in the same directory

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
  if (file.mimetype === "application/pdf") {
    cb(null, true); // accept the file
  } else {
    cb(new Error("Only PDF files are allowed!"), false); // reject the file
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
router.post(
  "/upload",
  passport.authenticate("jwt", { session: false }),
  upload.single("file"),
  async (req, res) => {
    // Check if file is provided
    let file = await req.file;
    if (!file) return res.status(400).send("No file uploaded.");
    let dbFile = await File.create({
      name: file.filename,
      createdBy: req.user.id, // Assuming req.user is populated by passport
    });
    if (!dbFile)
      return res.status(500).send("Could not save file info to database.");

    res.json({
      message: "File uploaded successfully!",
      filename: req.file.filename,
      url: `/files/${req.file.filename}`,
    });
  }
);

router.get(
  "/files",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
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
  }
);

router.get(
  "/getUser",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { role } = req.body;
    if (!role) {
      return res.status(400).json({ message: "Role not provided" });
    }
    let result = await User.findOne({ role: role });
    if (!result) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json({ user: result });
  }
);

router.post("/submit_form", async (req, res) => {
  const { role, name, description, data } = req.body;
  if (!role === "user") {
    return res.status(403).json({ message: "Only user can submit form!" });
  }
  let petitioner = await User.findOne({ role: role });
  if (!userila) {
    return res.status(404).json({ message: "User not found" });
  }
  console.log("User found:", petitioner);

  // Validate required fields
  if (!name || !data) {
    return res.status(400).json({ message: "Name, data are required." });
  }

  try {
    // Create a new document
    const newDocument = await Document.create({
      name: name,
      description: description || "", // Default to an empty string if no description is provided
      data: data || {}, // Default to an empty object if no data is provided
      workflowStepType: "dep_sef_review",
      createdBy: userila._id, // Assuming req.user is populated by passport
      //append to docHistory
      docHistory: [
        {
          action: "initial_submit",
          timestamp: new Date(),
          user: petitioner._id,
        },
      ],
    });

    res.status(201).json({
      message: "Document created successfully",
      document: newDocument,
    });
  } catch (error) {
    console.error("Error creating document:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/my_work", async (req, res) => {
  const { role, name, description, data } = req.body;
  if (role === "user") {
    return res.status(403).json({ message: "Forbidden" });
  }
  const worker = await User.findOne({ role: role });
  if (!worker) {
    return res.status(404).json({ message: "User not found" });
  }
  console.log("User found:", worker);

  // const workflowEntities = await WorkflowEntity.find({ roles: userila.role });
  const my_WorkflowEntity = await WorkflowEntity.findOne({
    roles: worker.role,
  });
  console.log("Workflow entities found:", my_WorkflowEntity);
  const documents = await Document.find({
    workflowStepType: my_WorkflowEntity.step_type,
  });
  if (!documents || documents.length === 0) {
    return res
      .status(404)
      .json({ message: "No documents found for this user" });
  }
  res.status(200).json({
    documents: documents,
    workflowEntities: my_WorkflowEntity,
  });
});

router.post("/action", async (req, res) => {
  let { role, action, doc_id } = req.body;
  if (!role || !action || !doc_id) {
    return res
      .status(400)
      .json({ message: "Role, action and document ID are required." });
  }
  if (role === "user") {
    return res.status(403).json({ message: "User cannot perform actions!" });
  }
  const worker = await User.findOne({ role: role });
  if (!worker) {
    return res.status(404).json({ message: "User not found" });
  }
  const my_WorkflowEntity = await WorkflowEntity.findOne({
    roles: worker.role,
  });
  if (!my_WorkflowEntity) {
    return res
      .status(404)
      .json({ message: "Workflow entity not found for this role" });
  }
  const document = await Document.findOne({ _id: doc_id });
  console.log("Document found:", document);
  if (!document) {
    return res.status(404).json({ message: "Document not found" });
  }
  const match = await my_WorkflowEntity.next_steps.find(
    (step) => step.on === action
  );
  if (!match) {
    return res
      .status(404)
      .json({ message: "No matching action found for this workflow step" });
  }
  console.log("Matching workflow step found:", document.workflowStepType);
  console.log("Action to perform:", match.type);
  if (
    document.workflowStepType !== my_WorkflowEntity.step_type &&
    document.workflowStepType !== "initial_submit"
  ) {
    return res.status(400).json({
      message: `Document is not in the correct step for action ${action}`,
    });
  }

  let result = await Document.updateOne(
    { _id: doc_id },
    {
      workflowStepType: match.type, // move to next step
      $push: {
        docHistory: {
          action: action,
          timestamp: new Date(),
          user: worker._id,
        },
      },
    }
  );
  if (result.nModified === 0) {
    return res.status(400).json({ message: "Document update failed" });
  }

  if (action === "acknowledge_doc" && worker.role === "primar") {
    console.log("Acknowledging document:", document);
    const petitioner = await User.findById(document.createdBy);
    if (!petitioner) {
      return res.status(404).json({ message: "Petitioner not found" });
    }
    send_email(
      petitioner.email,
      "Document Acknowledged",
      `Your document ${document.name} has been acknowledged by ${worker.name}.`
    );
  }
  console.log("Document updated successfully:", document);

  return res.status(200).json({
    message: "Action performed successfully",
    nextStep: match,
  });
});


router.get('/document', async(req, res) => {    
  //get id from query params
  const { role, id } = req.body;
  let worker = await User.findOne({role: role});
  if (!worker) {
    return res.status(404).json({ message: "worker not found" });
  }
  let document = await Document.findOne({ _id: id });
  if (!document) {
    return res.status(404).json({ message: "Document not found" });
  }
  console.log("Document found:", document);
  let my_WorkflowEntity = await WorkflowEntity.findOne({
    step_type: document.workflowStepType,
  });
  if (!my_WorkflowEntity) {
    return res.status(404).json({ message: "Workflow entity not found" });
  }
  if (my_WorkflowEntity.roles.indexOf(user.role) === -1 || createdBy !== worker._id.toString()) {
    return res.status(403).json({ message: "You are not allowed to view this document" });
  }
  return res.status(200).json({
    document: document,
    workflowEntity: my_WorkflowEntity,
  });
})

router.get('/my_documents', async(req, res) => {
  const { role } = req.body;
  if (!role) {
    return res.status(400).json({ message: "Role not provided" });
  }
  let user = await User.findOne({role:role});
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  let documents = await Document.find({ createdBy: user._id });
  if (!documents || documents.length === 0) {
    return res.status(404).json({ message: "No documents found for this user" });
  }
  console.log("Documents found:", documents);
  return res.status(200).json({
    documents: documents,
  });
})

module.exports = router;
