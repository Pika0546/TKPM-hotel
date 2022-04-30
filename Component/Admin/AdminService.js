const {models} = require('../../models')

class AdminService  {
    findAccountByUsername = async (username) => {
        return models.admin.findOne({
            raw: true,
            where:{
                username: username,
            }
        })
    }

    findAccountById = async (id) => {
        return models.admin.findOne({
            raw:true,
            where:{
                id:id
            }
        })
    }

    findAccountByToken = async (token) => {
        return models.admin.findOne({
            raw:true,
            where:{
                token:token
            }
        })
    }

    updateAccountToken = async (id, token) => {
        return models.admin.update({
            token: token
        }, {
            where:{
                id:id
            }
        })
    }
}
module.exports = new AdminService();