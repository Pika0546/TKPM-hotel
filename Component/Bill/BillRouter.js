const express = require('express');
const router = express.Router();

const BillController = require('./BillController');

router.get('/', BillController.getBillList);
router.get('/api', BillController.getBillListApi);
router.get('/add', BillController.getAddBill);
router.get('/add/api', BillController.getAddModalBill);
router.post('/add', BillController.createBill);
router.get('/:id', BillController.getDetailBill);

module.exports = router;
