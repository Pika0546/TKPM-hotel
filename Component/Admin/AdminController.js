const createError = require('http-errors');
const AdminService = require("./AdminService");

class AdminController{
    //[GET] /login
    getLoginPage(req, res, next){
        res.render('account/login', {
            layout:false,
            message: req.flash('error'),
        });
    }

    //[POST] /logout
    logout(req, res, next){
        req.logout();
        res.redirect('/');
    }

    //[GET] /register
    getRegisterPage(req, res, next){
        res.render('account/register', {
            layout:false,
        });
    }

    //[GET] /password-recovery
    getPasswordRecoveryPage(req, res, next){
        res.render('account/forgot-password', {
            layout:false,
        });
    }


    async checkUsernameAPI(req,res,next){
        const {username} = req.body;
        try{
            const result = await AdminService.findAccountByUsername(username)
            if(result){
                res.status(200).json({isExisted: true});
            }
            else{
                res.status(200).json({isExisted: false});
            }
        }
        catch(err){
            onsole.log(error);
            res.status(500).json(error);
        }
    }


    getAdminList = async (req, res, next) => {
        res.status(200).json("HELLO")
    }

}

module.exports = new AdminController();