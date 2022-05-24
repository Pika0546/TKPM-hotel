const express = require('express');
const router = express.Router();

const AdminController = require('./AdminController');

router.get('/', AdminController.getAdminList)
router.get('/api', AdminController.getAdminListAPI)
router.get('/add', AdminController.getAdminCreate)
router.post('/add', AdminController.createAdmin)
router.get('/:id', AdminController.getAdminDetail)
module.exports = router;