const AdminService = require("../Component/Admin/AdminService");
class TokenUtil{
    saveRememberMeToken = async (token, id, fn) => {
        await AdminService.updateAccountToken(id, token);
        return fn();
    }
    
    consumeRememberMeToken = async (token, fn) => {
        const {id} = await AdminService.findAccountByToken(token);
        fn(null, id);
    }
    
    
    issueToken =  async (user, done) => {
        var token = uuidv4();
        await saveRememberMeToken(token, user.id, function(err) {
            if (err) { return done(err); }
            return done(null, token);
        });
    }
}

module.exports = new TokenUtil();