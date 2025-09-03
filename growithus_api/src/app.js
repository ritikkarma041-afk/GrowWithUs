
const express = require('express');
const cors = require('cors');
const apiRouter = require('./routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', apiRouter);

// Basic error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

module.exports = app;
