const router = require('express').Router();
const UserController = require('../controllers/usersController');
const { check } = require('../common/middlewares/IsAuthenticated');

router.get('/', check, UserController.getUser);
router.get('/all', check, UserController.getAllUsers);
router.get('/userDetailsById/:userId', check, UserController.getCombinedUserDataByUserId);
router.post('/', check, UserController.updateOrCreateUserProfile);
module.exports = router;