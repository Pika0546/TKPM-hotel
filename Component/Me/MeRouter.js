const express = require('express');
const MeController = require('./MeController');
const router = express.Router();

router.get('/profile', MeController.getProfile);
router.post('/profile', MeController.updateProfile);
router.get('/change-password', MeController.getChangePassword);
router.post('/change-password', MeController.updatePassword);

module.exports = router;