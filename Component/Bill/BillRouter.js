const express = require('express');
const router = express.Router();

const BillController = require('./BillController');

router.get('/', BillController.getBillList);
router.get('/add', BillController.getAddBill);
router.get('/detail/:id', BillController.getDetailBill);

module.exports = router;
