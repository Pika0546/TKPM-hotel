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
                    attributes:['fullname', 'address'],
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
                    attributes:['id', 'roomId', 'typeId'],
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

    getRoomBeingRentList = async () => {
        return models.roomrent.findAll({
            raw: true,
            where:{
                billId:{
                    [Op.is]: null
                }
            },
            include: [
                {
                    model: models.room,
                    attributes: ['id', 'roomId', 'typeId'],
                    require: true,
                    include: [
                        {
                            model: models.roomtype,
                            attributes:['price'],
                            require: true
                        }
                    ]
                }
            ],
            order: [
                [models.room, 'roomId', 'ASC']
            ]
        })
    }

    getRoomBeingRent = async (roomRentId) => {
        return models.roomrent.findOne({
            raw: true,
            where:{
                id: roomRentId
            },
            include: [
                {
                    model: models.room,
                    attributes: ['id', 'roomId', 'typeId'],
                    require: true,
                    include: [
                        {
                            model: models.roomtype,
                            attributes:['price'],
                            require: true
                        }
                    ]
                }
            ],
            order: [
                [models.room, 'roomId', 'ASC']
            ]
        })
    }

    getRoomRentById = async (id) => {
        return models.roomrent.findOne({
            raw: true,
            where:{
                id: id
            }
        })
    }

    createGuest = async (guest) => {
        return models.guest.create({
            fullname: guest.fullname,
            address: guest.address
        });
    }

    createBill = async (guestId) => {
        return models.bill.create({
            guestId: guestId
        });
    }

    updateBillOfRoomRent = async (roomRentId, billId) => {
        return models.roomrent.update(
            {
                billId: billId
            },
            {
                where: {
                    id: roomRentId
                }
            }
        )
    }
}

module.exports = new BillService();