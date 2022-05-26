const { models } = require("../../models");

class RoomRentService{
    findRoomRentById = async (id) => {
        return models.roomrent.findOne({
            raw:true,
            where:{
                id:id
            }
        })
    }
    deleteRoomRentById = async (id) => {
        return models.roomrent.destroy({
            where: {
                id: id
            },
        });
    }
}

module.exports = new RoomRentService();