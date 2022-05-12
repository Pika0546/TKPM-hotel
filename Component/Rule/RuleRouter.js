const express = require('express');
const router = express.Router();

const RuleController = require("./RuleController")

router.get('/', RuleController.getRulePage);
router.post('/guest-type/add/api', RuleController.addGuestTypeApi)
module.exports = router;