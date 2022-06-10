const { Op } = require("sequelize");

const { models } = require("../../models");
const RoomService = require("../Room/RoomService");

class RoomRentService{
    getRoomRentList = async (limit, page, roomId, rentDateFrom, rentDateTo, status) => {
        if (parseInt(status) === 1){
            return models.roomrent.findAll({
                raw: true,
                offset: (page - 1)*limit, 
                limit: limit,
                where:{
                    ...(rentDateFrom && rentDateTo && {createdAt: {[Op.between]: [rentDateFrom, rentDateTo]}}),
                    ...(status && status.length && {billId: {[Op.is]: null}}),
                },
                include: [
                    {
                        model: models.room,
                        where:{
                            ...(roomId && roomId.length && {roomId: {[Op.substring]:roomId}})
                        },
                        require: true
                    },
                ]
            });
        }
        else {
            return models.roomrent.findAll({
                raw: true,
                offset: (page - 1)*limit, 
                limit: limit,
                where:{
                    ...(rentDateFrom && rentDateTo && {createdAt: {[Op.between]: [rentDateFrom, rentDateTo]}}),
                    ...(status && status.length && {billId: {[Op.not]: null}}),
                },
                include: [
                    {
                        model: models.room,
                        where:{
                            ...(roomId && roomId.length && {roomId: {[Op.substring]:roomId}})
                        },
                        require: true
                    },
                ]
            });
        }
    }

    countAllRoom = async (roomId, rentDateFrom, rentDateTo, status) => {
        if (parseInt(status) === 1){
            return models.roomrent.count({
                where:{
                    ...(roomId && roomId.length && {roomId: {[Op.substring]:roomId}}),
                    ...(rentDateFrom && rentDateTo && rentDateFrom.length && rentDateTo.length && {createdAt: {[Op.between]: [rentDateFrom, rentDateTo]}}),
                    ...(status && status.length && {billId: {[Op.is]: null}}),
                }
            });
        }
        else {
            return models.roomrent.count({
                where:{
                    ...(roomId && roomId.length && {roomId: {[Op.substring]:roomId}}),
                    ...(rentDateFrom && rentDateTo && rentDateFrom.length && rentDateTo.length && {createdAt: {[Op.between]: [rentDateFrom, rentDateTo]}}),
                    ...(status && status.length && {billId: {[Op.not]: null}}),
                }
            });
        }
    }
    
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
    getGuestTypeList = async () => {
        return models.guesttype.findAll({
            raw:true
        })
    }

    getGuetsByRoomRentId = async (id) => {
        return models.guest.findAll({
            raw: true,
            where:{roomRentId:id}
        })
    }
    getRoomByRoomRentId = async (id) => {
        const roomRent = await this.findRoomRentById(id);
        const roomId = roomRent.roomId;
        return models.room.findOne({
            raw: true,
            where:{id:roomId}
        })
    }

    createRoomRent = async (id) => {
        return models.roomrent.create({
            roomId: id
        })
    }

    deleteGuestByIdentityNumber = async (identityNumber) => {
        return models.guest.destroy({
            where: {
                identityNumber: identityNumber
            },
        });
    }

    createGuest = async (guest) => {
        const {guestName, guestType, guestId, address, roomRentId} = guest;
        return models.guest.create({
            fullname:guestName,
            identityNumber:guestId,
            address: address,
            typeId: guestType,
            roomRentId: roomRentId
        })
    }

    createGuestAPI = async (guest) => {
        const {fullname, identityNumber, typeId, address, roomRentId} = guest;
        return models.guest.create({
            fullname:fullname,
            identityNumber:identityNumber,
            address: address,
            typeId: typeId,
            roomRentId: roomRentId
        })
    }
}

module.exports = new RoomRentService();