const RoomRentService = require('./RoomRentService')

class RoomRentController{
    getRoomRentList = async (req, res, next) => {
        res.render('roomrent/list')
    }
    getAddRoomRent = async (req, res, next) => {
        res.render('roomrent/add');
    }
    getDetailRoomRent = async (req, res, next) => {
        res.render('roomrent/edit');
    }
}

module.exports = new RoomRentController();