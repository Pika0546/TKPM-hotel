class HomeController{
    getHomePage = async (req, res, next) => {
        res.render('home');
    }
}

module.exports = new HomeController();