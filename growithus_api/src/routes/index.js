const express = require('express');
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes'); // Replace with the actual user routes file

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes); // Replace with the actual user routes file
// You can add other routes here, e.g., router.use('/users', userRoutes);

module.exports = router;
