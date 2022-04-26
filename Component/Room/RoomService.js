const {models} = require('../../models')


class RoomService{
    getRoomList = (limit, page) => {
        return models.room.findAll({
            raw: true,
            offset: (page - 1)*limit, 
            limit: limit,
            include: {
                model: models.roomtype,
                require: true
            }
        });
    }

    countAllRoom = () => {
        return models.room.count();
    }
}

module.exports = new RoomService();