const passport = require('passport'),
LocalStrategy = require('passport-local').Strategy,
RememberMeStrategy = require('../node_modules/passport-remember-me/lib').Strategy;
// const RememberMeStrategy = require('../node_modules/passport-remember-me/lib').Strategy;
// const LocalStrategy = require('passport-local').Strategy;    

const bcrypt = require('bcrypt');
const AdminService = require('../Component/Admin/AdminService');
const { SALT_BCRYPT } = require("../config");
const TokenUtil = require('../utils/token');


const validateAccount = async (username, password, done) => {
    try {
        const user = await AdminService.findAccountByUsername(username, password)
    
        if(!user){
            return done(null, false, { message: 'Incorrect username.' });
        }
        const result = await validPassword(user, password);
        console.log(user);
        console.log(result);
        if(result){
            return done(null, user);
        }
        else{
            return done(null, false, { message: 'Incorrect password.' });
        }
    } catch (error) {
        console.log(error)
        return done(error)
    }
}



passport.use(new LocalStrategy(
    {
        usernameField: 'username',
        passwordField: 'password'
    },validateAccount
));

passport.use(new RememberMeStrategy(
	async function(token, done) {
		try {
            console.log("here");
            await TokenUtil.consumeRememberMeToken(token, function(err, uid) {
                
                if (err) { return done(err); }
                if (!uid) { return done(null, false); }
                AdminService.findAccountById(uid).then(admin=>{
                    if(!admin){
                        done(null, false);
                    }
                    else{
                        done(null, user);
                    }
                })
                .catch(err=>{
                    console.log(error)
                    done(err); 
                })
            });
        } catch (error) {
            console.log(error);
            done(error);
        }
	},
	TokenUtil.issueToken
));


passport.serializeUser(function(user, done) {
    done(null, user.id);
});
  
passport.deserializeUser(function(id, done) {
    AdminService.findAccountById(id)
    .then(user=>{
        done(null ,user);
    })
    .catch(err=>{
        done(err);
    })
});
async function validPassword(user, password){
    return bcrypt.compare(password, user.password);
}


module.exports = passport;