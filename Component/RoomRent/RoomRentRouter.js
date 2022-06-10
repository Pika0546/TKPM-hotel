const express = require('express');
const router = express.Router();

const RoomRentController = require('./RoomRentController');

router.get('/', RoomRentController.getRoomRentList);
router.get('/api', RoomRentController.getRoomRentListApi);
router.get('/add', RoomRentController.getAddRoomRent);
router.post('/add', RoomRentController.createRoomRent);
router.get('/edit/:id', RoomRentController.getDetailRoomRent);
router.post('/api/update/:id', RoomRentController.updateRoomRentAPI);
router.post('/api/delete/:id', RoomRentController.deleteRoomRentAPI);
module.exports = router;
