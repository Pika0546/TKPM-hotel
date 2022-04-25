const AdminService = require("./AdminService");

class AdminController{
    //[GET] /login
    getLoginPage(req, res, next){
        res.render('account/login', {
            layout:false,
            message: req.flash('error'),
        });
    }

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

    async checkUsername(req,res,next){
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
            console.log(err);
            res.status(500).json({msg: "Bad request"});
        }
    }

}

module.exports = new AdminController();