const RoomRentService = require('./RoomRentService')

class RoomRentController{
    getRoomRentList = async (req, res, next) => {
        
        res.status(200).json("Hello");
    }
}

module.exports = new RoomRentController();