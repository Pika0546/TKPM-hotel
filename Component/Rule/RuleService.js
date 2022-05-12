const {models} = require("../../models");

class RuleService{
    getGuestTypeList = async () => {
        return models.guesttype.findAll({
            raw:true,
        })
    }

    getRoomTypeList = async () => {
        return models.roomtype.findAll({
            raw:true,
        })
    }

    getRule = async () => {
        return models.rule.findAll({
            raw:true
        })
    }

    createGuestType = async (name, coefficient) => {
        return models.guesttype.create({
            typeName:name,
            coefficient: coefficient
        })
    }

    updateGuestType = async (id, typeName, coefficient) => {
        return models.guesttype.update({
            typeName:typeName,
            coefficient: coefficient
        },{
            where:{
                id:id
            }
        })
    }

    deleteGuestType = async (id) => {
        return models.guesttype.destroy({
            where:{
                id:id
            }
        })
    }

    findGuestTypeByName = async (name) => {
        return models.guesttype.findOne({
            raw:true,
            where:{
                typeName: name
            }
        })
    }

    findGuestTypeById = async (id) => {
        return models.guesttype.findOne({
            raw:true,
            where:{
                id: id
            }
        })
    }

    createRoomType = async (name, price) => {
        return models.roomtype.create({
            typeName:name,
            price: price
        })
    }

    updateRoomType = async (id, typeName, price) => {
        return models.roomtype.update({
            typeName:typeName,
            price: price
        },{
            where:{
                id:id
            }
        })
    }

    deleteRoomType = async (id) => {
        return models.roomtype.destroy({
            where:{
                id:id
            }
        })
    }

    findRoomTypeByName = async (name) => {
        return models.roomtype.findOne({
            raw:true,
            where:{
                typeName: name
            }
        })
    }

    findRoomTypeById = async (id) => {
        return models.roomtype.findOne({
            raw:true,
            where:{
                id: id
            }
        })
    }
}

module.exports = new RuleService();