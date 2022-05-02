const express = require('express');
const router = express.Router();

const SiteController = require('./SiteController');

router.get('/', SiteController.getHomePage);
router.get('/api/room-type', SiteController.getRoomTypeAPI);
router.get('/api/room-density', SiteController.getRoomDenstityAPI);
router.get('/account/login', SiteController.getLoginPage);
router.get('/account/forgot-password', SiteController.getForgotPasswordPage);
module.exports = router;
