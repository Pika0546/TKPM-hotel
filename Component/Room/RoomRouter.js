const express = require('express');
const router = express.Router();

const RoomController = require('./RoomController');

router.get('/', RoomController.getRoomList);
router.get('/api', RoomController.getRoomListApi);
router.post('/api/validate-room', RoomController.validateRoomIdAPI);
router.get('/add', RoomController.getAddRoom);
router.post('/add', RoomController.createRoom);
router.get('/edit/:id', RoomController.getEditRoom);
router.post('/edit/:id', RoomController.updateRoom);
module.exports = router;
