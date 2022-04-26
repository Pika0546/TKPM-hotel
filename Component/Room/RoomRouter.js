const express = require('express');
const router = express.Router();

const RoomController = require('./RoomController');

router.get('/', RoomController.getRoomList);
router.get('/api', RoomController.getRoomListApi);
router.get('/add', RoomController.getAddRoom);
router.get('/edit/:id', RoomController.getEditRoom);
module.exports = router;
