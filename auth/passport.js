const passport = require('passport'), LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const AdminService = require('../Component/Admin/AdminService');
const { SALT_BCRYPT } = require("../config");


const validateAccount = async (username, password, done) => {
    try {
        const admin = await AdminService.findAccountByUsername(username, password)
        if(!admin){
            return done(null, false, { message: 'Incorrect username.' });
        }
        const result = await validPassword(admin, password);
        if(result){
            return done(null, admin);
        }
        else{
            return done(null, false, { message: 'Incorrect password.' });
        }
    } catch (error) {
        return done(error)
    }
}

passport.use(new LocalStrategy(
    {
        usernameField: 'username',
        passwordField: 'password'
    },validateAccount));
passport.serializeUser(function(user, done) {
    done(null, user.id);
});
  
passport.deserializeUser(function(id, done) {
    AdminService.findAccountById(id)
    .then(admin=>{
        done(null ,admin);
    })
    .catch(err=>{
        done(err);
    })
});
function validPassword(admin, password){
    return bcrypt.compare(password, admin.password);
}


module.exports = passport;