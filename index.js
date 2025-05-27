const express = require("express");
const { connect, disconnect } = require("./db/db"); // Assuming db.js is in the db folder
const app = express();
const PORT = 3000;

const db = connect(); // Initialize database connection
// Middleware (optional)
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
