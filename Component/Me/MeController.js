const MeService = require('./MeService');
const createError = require('http-errors');
const bcrypt = require('bcrypt');
const { SALT_BCRYPT } = require('../../config');

class MeController{
    getProfile = async (req, res, next) => {
        res.render('me/profile',{
            message: req.flash('update-profile'),
        })
    }

    getChangePassword = async (req, res, next) => {
        res.render('me/change-password',{
            message: req.flash('change-password'),
        });
    }

    updateProfile = async (req, res, next) => {
        const {fullname, identityNumber, address} = req.body;
        let isValid = true;
        if(!fullname){
            isValid= false;
            req.flash("update-profile", {success: false, message: "Họ tên không được bỏ trống"})
        }

        if(!identityNumber){
            isValid= false;
            req.flash("update-profile", {success: false, message: "Số CMND/CCCD không được bỏ trống"})
        }

        if(!address){
            isValid= false;
            req.flash("update-profile", {success: false, message: "Địa chỉ không được bỏ trống"})
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

    updatePassword = async (req, res, next) => {
        try {
            const {password, newPassword, confirmPassword} = req.body;
            const isValidOldPassword = await bcrypt.compare(password, req.user.password);
            let isOK = true;
            if(!isValidOldPassword){
                isOK = false;
                req.flash("change-password", {success: false, message: "Mật khẩu không chính xác", data:{password, newPassword, confirmPassword}})
                res.redirect("/me/change-password")
                return;
            }

            if(newPassword !== confirmPassword){
                isOK = false;
                req.flash("change-password", {success: false, message: "Mật khẩu nhập lại phải trùng với mật khẩu mới", data:{password, newPassword, confirmPassword}})
                res.redirect("/me/change-password")
                return;
            }

            if(isOK){
                const hashPassword = await bcrypt.hash(newPassword, SALT_BCRYPT)
                const resData = await MeService.updatePassword(req.user.id, hashPassword);
                req.flash("change-password", {success: true, message: "Thay đổi mật khẩu thành công!"})
                res.redirect("/me/change-password")
                // res.status(200).json({message: "Update password successfully"});
            }
        } catch (error) {
            console.log(error)
            next(createError(500))
        }
        
    }
}

module.exports = new MeController();