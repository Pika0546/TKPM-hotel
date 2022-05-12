const {models} = require("../../models");

class RuleService{
    getGuestTypeList = async (limit, page) => {
        return models.guesttype.findAll({
            raw:true,
            offset: (page - 1)*limit,
            limit: limit
        })
    }

    getRoomTypeList = async (limit, page) => {
        return models.roomtype.findAll({
            raw:true,
            offset: (page - 1)*limit,
            limit: limit
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

    findGuestTypeByName = async (name) => {
        return models.guesttype.findOne({
            raw:true,
            where:{
                typeName: name
            }
        })
    }
}

module.exports = new RuleService();