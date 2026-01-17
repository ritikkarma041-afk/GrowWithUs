const router = require('express').Router();
const UserTrnController = require('../controllers/userTransactionController');
const { check } = require('../common/middlewares/IsAuthenticated');

router.get('/', check, UserTrnController.getUserTrn);
router.get('/all', check, UserTrnController.getAllUserTrn);
router.post('/add', check, UserTrnController.createUserTrn);

module.exports = router;


