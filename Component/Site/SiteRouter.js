const express = require('express');
const router = express.Router();

const SiteController = require('./SiteController');

router.get('/', SiteController.getHomePage);

module.exports = router;
