const express = require("express");
const bodyParser = require('body-parser');
const passport = require('passport');
const { connect, disconnect } = require("./db/db"); // Assuming db.js is in the db folder

const unprotectedRoutes = require('./routes/unprotected');
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');

const cors = require('cors');
const app = express();
const PORT = 3000;

const db = connect(); // Initialize database connection
// Middleware (optional)
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

require('./config/passport')(passport);
app.use(passport.initialize());

app.use('/', unprotectedRoutes);
app.use('/auth', authRoutes);
app.use('/dashboard', dashboardRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
