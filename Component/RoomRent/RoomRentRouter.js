const express = require('express');
const router = express.Router();

const RoomRentController = require('./RoomRentController');

router.get('/', RoomRentController.getRoomRentList);

module.exports = router;
