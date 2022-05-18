const express = require('express');
const router = express.Router();

const RoomRentController = require('./RoomRentController');

router.get('/', RoomRentController.getRoomRentList);
router.get('/add', RoomRentController.getAddRoomRent);
router.get('/edit', RoomRentController.getDetailRoomRent);

module.exports = router;
