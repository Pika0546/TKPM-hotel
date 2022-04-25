const express = require('express');
const router = express.Router();
const passport = require('passport');
const AdminController = require('../Component/Admin/AdminController');

router.get('/login', AdminController.getLoginPage);
router.post("/login",  
    passport.authenticate('local',
    { 
        successRedirect: '/',
        failureRedirect: '/account/login',
        failureFlash: true 
    }),
    function(req, res) {
        if(req.user){
            res.redirect("/");
        }else{
            res.redirect("/account/login");
        }
    });
router.get('/forgot-password', AdminController.getPasswordRecoveryPage);
module.exports = router;
