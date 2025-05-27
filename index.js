const express = require('express');
const app = express();
const PORT = 3000;

// Middleware (optional)
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
