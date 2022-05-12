const BillService = require('./BillService');

class BillController{
    getBillList = async (req, res, next) => {
        res.render('bill/list')
    }
    getAddBill = async (req, res, next) => {
        res.render('bill/add');
    }
    getDetailBill = async (req, res, next) => {
        res.render('bill/detail');
    }
}

module.exports = new BillController();