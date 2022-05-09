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
}

module.exports = new RuleService();