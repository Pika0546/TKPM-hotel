const express = require('express');
const router = express.Router();

const AdminController = require('./AdminController');

router.get('/', AdminController.getAdminList)
router.get('/add', AdminController.getAdminCreate)
router.get('/:id', AdminController.getAdminDetail)
module.exports = router;