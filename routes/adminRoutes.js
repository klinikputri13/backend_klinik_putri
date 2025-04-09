const express = require('express');
const AdminController = require('../controllers/AdminController');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();
router.use(authenticateToken);


router.get('/list', AdminController.getAllAdmin);
router.post('/create', AdminController.createAdmin);

module.exports = router;