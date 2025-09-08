const express = require('express');
const authController = require('../controllers/auth.controller');

const router = express.Router();

router.post('api/signup', authController.signup);
router.post('api/login', authController.login);

module.exports = router;
