const { Op } = require("sequelize");

const {models} = require('../../models')

const statusConverter = require('../../utils/RoomStatusConverter');

class RoomService{
    getRoomList = async (limit, page, roomId, typeId, status) => {
        const roomList = await models.room.findAll({
            raw: true,
            offset: (page - 1)*limit, 
            limit: limit,
            where:{
                ...(roomId && roomId.length && {roomId: {[Op.substring]:roomId}}),
                ...(typeId && typeId.length && {typeId: parseInt(typeId)}),
                ...(status && status.length && {status: statusConverter[status]}),
            },
            include: [
                {
                    model: models.roomtype,
                    require: true
                },
            ]
        });
        const roomRentList = await models.roomrent.findAll({
            raw:true,
            where:{
                billId:{
                    [Op.is]: null
                }
            }
        })
        return roomList.map(room=>{
            if(room.status != "Trống"){
                for(let i = 0; i < roomRentList.length; i++){
                    if(room.id === roomRentList[i].roomId){
                        return {
                            ...room,
                            roomRentId: roomRentList[i].id
                        }
                    }
                }
            }
            return {
                ...room,
                roomRendId: null
            }
        })
    }

    getRoomTypeList = async () => {
        return models.roomtype.findAll({raw:true});
    }

    countAllRoom = async (roomId, typeId, status) => {
        return models.room.count({
            where:{
                ...(roomId && roomId.length && {roomId: {[Op.substring]:roomId}}),
                ...(typeId && typeId.length && {typeId: parseInt(typeId)}),
                ...(status && status.length && {status: statusConverter[status]}),
            }
        });
    }

    getRoomByRoomId = async (roomId) => {
        return models.room.findOne({
            raw:true,
            where:{
                roomId: roomId
            },
            include: [
                {
                    model: models.roomtype,
                    require: true
                },
            ]
        })
    }

    createRoom = async (roomId, type, note) => {
        return models.room.create({
            roomId: roomId,
            typeId: type,
            note: note,
            status: "Trống"
        })
    }

    updateRoom = async (id, roomId, typeId, note) => {
        return models.room.update(
            {
                roomId, typeId, note
            },
            {
                where:{
                    id: id
                }
            }
        )
    }

    deleteRoomByRoomId = async (roomId) => {
        return models.room.destroy({
            where: {
                roomId: roomId
            },
        });
    }
}

module.exports = new RoomService();