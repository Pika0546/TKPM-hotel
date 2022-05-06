const BillService = require('./BillService');

class BillController{
    getBillList = async (req, res, next) => {
        res.status(200).json("Hello")
    }
}

module.exports = new BillController();