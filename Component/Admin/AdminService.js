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

    getAdminList = (limit, page, fullname) => {
        return models.admin.findAll({
            raw:true,
            offset: (page - 1)*limit, 
            limit: limit,
            where:{
                ...(fullname && fullname.length && {fullname: {[Op.substring]:fullname}}),
            }
        })
    }

    countAllAdmin = (fullname) => {
        return models.admin.count({
            where:{
                ...(fullname && fullname.length && {fullname: {[Op.substring]:fullname}}),
            }
        })
    }
}
module.exports = new AdminService();