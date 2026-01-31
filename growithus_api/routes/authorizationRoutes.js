const router = require('express').Router();
const AuthController = require('../controllers/authorizationController');
router.post('/signup', AuthController.register);
router.post('/login', AuthController.login);
router.post('/resetPass', AuthController.resetPassword);
module.exports = router;