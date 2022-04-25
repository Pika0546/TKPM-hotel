class SiteController{
    getHomePage = async (req, res, next) => {
        res.render('home');
    }

    getLoginPage = async (req, res, next) => {
        res.render('login');
    }

    getForgotPasswordPage = async (req, res, next)=>{
        res.render('forgot-password');
    }
}

module.exports = new SiteController();