const {models} = require('../../models')

class AdminService  {
    findAccountByUsername = (username) => {
        return models.admin.findOne({
            raw: true,
            where:{
                username: username,
            }
        })
    }

    findAccountById = (id) => {
        return models.admin.findOne({
            raw:true,
            where:{
                id:id
            }
        })
    }
}
module.exports = new AdminService();