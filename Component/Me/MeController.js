const MeService = require('./MeService');

class MeController{
    getProfile = async (req, res, next) => {
        res.render('me/profile')
    }
}

module.exports = new MeController();