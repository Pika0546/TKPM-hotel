const { Op } = require("sequelize");


const {models} = require('../../models')

class SiteService{  
    getRoomRentDetail = async (startDate, endDate) => {
        return models.roomrent.findAll({
            raw:true,
            paranoid: false,
            include:[
                {
                    model:models.room,
                    require:true,
                    include:[
                        {
                            model: models.roomtype,
                            require: true,
                           
                        },
                    ],
                    paranoid: false,
                },
                {
                    model:models.bill,
                    require:true,
                    where:{
                        createdAt:{
                            [Op.between]:[startDate, endDate]
                        }
                    }
                },
            ],
            where:{
                billId: {
                    [Op.not]: null
                }
                
            }
        })
    }
    
    getRoomGuest = async (roomRentId) => {
        return models.guest.findAll({
            raw:true,
            where:{
                roomRentId: roomRentId
            },
            include:[
                {
                    model: models.guesttype,
                    require: true,
                }
            ]
            
        })
    }

    getRule = async () => {
        return models.rule.findAll({
            raw:true,
        })
    }

    getRoomTypeList = async () => {
        return models.roomtype.findAll({
            raw:true
        })
    }

    getRoomList = async () => {
        return models.room.findAll({
            raw:true
        })
    }
}

module.exports = new SiteService();