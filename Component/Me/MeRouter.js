const express = require('express');
const MeController = require('./MeController');
const router = express.Router();


router.get('/profile', MeController.getProfile);
router.post('/profile', MeController.updateProfile);
module.exports = router;