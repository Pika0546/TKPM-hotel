const createError = require('http-errors');
const AdminService = require("./AdminService");
const passport = require('passport');

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
        res.clearCookie('remember_me');
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
            onsole.log(error);
            res.status(500).json(error);
        }
    }

    // async login(req, res,next){
    //     passport.authenticate('local',
    //     { 
    //         failureRedirect: '/account/login',
    //         failureFlash: true 
    //     }),
    //     function(req, res,next){
    //         if (!req.body.remember_me) { return next(); }
    //     },
    //     function(req, res) {
    
    //         if(req.user){   
    //             res.redirect("/");
    //         }else{
    //             res.redirect("/account/login");
    //         }
    //     };
    // }

}

module.exports = new AdminController();