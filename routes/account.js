const express = require('express');
const router = express.Router();
const passport = require('passport');
const AdminController = require('../Component/Admin/AdminController');
const TokenUtil = require('../utils/token');

router.get('/login', AdminController.getLoginPage);
router.post("/login",  
    passport.authenticate('local',
    { 
        failureRedirect: '/account/login',
        failureFlash: true 
    }),
    function(req, res,next){
        console.log(req.body);
        if (!req.body.remember_me) { return next(); }
        TokenUtil.issueToken(req.user, (err, token)=>{
            if (err) { return next(err); }
			res.cookie('remember_me', token, { path: '/', httpOnly: true, maxAge: 604800000 });
			return next();
        })        
    },
    function(req, res) {
        if(req.user){   
            res.redirect("/");
        }else{
            res.redirect("/account/login");
        }
    });
router.post('/logout', AdminController.logout);
router.get('/forgot-password', AdminController.getPasswordRecoveryPage);
module.exports = router;
