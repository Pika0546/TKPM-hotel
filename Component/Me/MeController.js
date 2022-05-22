const MeService = require('./MeService');
const createError = require('http-errors');

class MeController{
    getProfile = async (req, res, next) => {
        console.log(req.user)
        res.render('me/profile',{
            message: req.flash('update-profile'),
        })
    }

    updateProfile = async (req, res, next) => {
        const {fullname, identityNumber, address} = req.body;
        let isValid = true;
        if(!fullname){
            isValid= false;
            req.flash("update-profile", {success: false, message: "Họ tên không hợp lệ"})
        }

        if(!identityNumber){
            isValid= false;
            req.flash("update-profile", {success: false, message: "Số CMND/CCCD không hợp lệ"})
        }

        if(!address){
            isValid= false;
            req.flash("update-profile", {success: false, message: "Địa chỉ không hợp lệ"})
        }

        if(isValid){
            try {
                const res = await MeService.updateProfile(req.user.id, fullname, address, identityNumber);
                req.flash("update-profile", {success: true, message: "Cập nhật thành công!"})
            } catch (error) {
                console.log(error)
                next(createError(500))
            }
        }
        res.redirect("/me/profile")
    }
}

module.exports = new MeController();