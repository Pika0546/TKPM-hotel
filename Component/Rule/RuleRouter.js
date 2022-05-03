const express = require('express');
const router = express.Router();

const RuleController = require("./RuleController")

router.get('/', RuleController.getRulePage);

module.exports = router;