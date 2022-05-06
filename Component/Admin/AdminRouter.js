const express = require('express');
const router = express.Router();

const AdminController = require('./AdminController');

router.get('/', AdminController.getAdminList)

module.exports = router;