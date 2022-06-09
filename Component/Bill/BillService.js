const { Op } = require("sequelize");

const {models} = require('../../models')

class BillService{
    getBillByBillId = async (billId) => {
        return models.bill.findOne({
            raw:true,
            where:{
                id: billId
            },
            include: [
                {
                    model: models.guest,
                    require: true
                }
            ]
        })
    }

    getRoomListByBillId = async (billId) => {
        return models.roomrent.findAll({
            raw: true,
            where:{
                billId: billId
            },
            include: [
                {
                    model: models.room,
                    require: true,
                    include: [
                        {
                            model: models.roomtype,
                            require: true
                        }
                    ]
                }
            ]
        })
    }

    getGuestsByRoomRentId = async (roomRentId) => {
        return models.guest.findAll({
            raw: true,
            where:{
                roomRentId: roomRentId
            },
            include: [
                {
                    model: models.guesttype,
                    require: true
                }
            ]
        })
    }

    getRule = async () => {
        return models.rule.findAll({
            raw: true
        })
    }
}

module.exports = new BillService();