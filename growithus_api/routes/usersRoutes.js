const router = require('express').Router();
const UserController = require('../controllers/usersController');
const { check } = require('../common/middlewares/IsAuthenticated');

router.get('/', check, UserController.getUser);
router.get('/all', check, UserController.getAllUsers);

module.exports = router;