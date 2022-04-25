const express = require('express');
const router = express.Router();

const AdminController = require('../Component/Admin/AdminController');

router.get('/login', AdminController.getLoginPage);
router.get('/forgot-password', AdminController.getPasswordRecoveryPage);
module.exports = router;
