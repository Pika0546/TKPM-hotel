const { Op } = require("sequelize");

const { models } = require("../../models");

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
}

module.exports = new RoomRentService();