const express = require('express');
const router = express.Router();

const RuleController = require("./RuleController")

router.get('/', RuleController.getRulePage);
router.post('/guest-type/add/api', RuleController.addGuestTypeApi)
router.post('/guest-type/edit/api', RuleController.editGuestTypeApi)
router.post('/guest-type/delete/api', RuleController.deleteGuestTypeApi)
router.post('/room-type/add/api', RuleController.addRoomTypeApi)
router.post('/room-type/edit/api', RuleController.editRoomTypeApi)
router.post('/room-type/delete/api', RuleController.deleteRoomTypeApi)
module.exports = router;