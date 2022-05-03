class RuleController{
    getRulePage = async (req, res, next) => {
        res.render('rule/index');
    } 
}

module.exports = new RuleController();