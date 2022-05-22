const { SALT_BCRYPT } = require('../../config')
const {models} = require('../../models')
class MeService{
    findAdminById = async (id) => {
        return models.admin.findOne({
            raw:true,
            where:{
                id:id
            }
        })
    }

    updateProfile = async (id, fullname, address, identityNumber) => {
        return models.admin.update({
            fullname: fullname,
            address: address,
            identityNumber: identityNumber
        },{
            where:{
                id: id
            }
        })
    }

    updatePassword = async (id, newPassword) => {
        return models.admin.update({
            password: newPassword
        },{
            where:{
                id:id
            }
        })
    }
}

module.exports = new MeService();