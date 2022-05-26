const express = require('express');
const router = express.Router();

const RoomRentController = require('./RoomRentController');

router.get('/', RoomRentController.getRoomRentList);
router.get('/add', RoomRentController.getAddRoomRent);
router.get('/edit', RoomRentController.getDetailRoomRent);
router.post('/api/delete/:id', RoomRentController.deleteRoomRentAPI);
module.exports = router;
