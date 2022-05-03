const express = require('express');
const router = express.Router();

const BillController = require('./BillController');

router.get('/', BillController.getBillList);

module.exports = router;
