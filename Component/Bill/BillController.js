const createError = require('http-errors');
const PageUtil = require('../../utils/page');
const DateUtil = require('../../utils/date');
const BillUtil = require('../../utils/bill');
const ObjectUtil = require('../../utils/object');

const BillService = require('./BillService');

class BillController{
    getBillList = async (req, res, next) => {
        res.render('bill/list')
    }
    getAddBill = async (req, res, next) => {
        res.render('bill/add');
    }
    getDetailBill = async (req, res, next) => {
        const {id: billId} = req.params;
        try {
            const bill = await BillService.getBillByBillId(billId);
            const roomList = await BillService.getRoomListByBillId(billId);
            if(bill && roomList){
                let returndate = new Date(bill.createdAt);
                let d = returndate.getUTCDate().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
                let m = (returndate.getUTCMonth() + 1).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
                let y = returndate.getUTCFullYear().toString();
                bill.billDate = d + '/' + m + '/' + y;
                let totalBillCost = 0;
                let roomListLen = Object.keys(roomList).length;
                for (let i = 0; i < roomListLen; i++) {
                    const guestList = await BillService.getGuestsByRoomRentId(roomList[i].id);
                    roomList[i].guests = guestList.map((item) => ObjectUtil.getObject(item));
                    roomList[i].numorder = i + 1;
                    let rentdate = new Date(roomList[i].createdAt);
                    roomList[i].numRentDays = Math.ceil(DateUtil.convertMilisecondtoDay(Math.abs(returndate - rentdate)));
                    const rule = await BillService.getRule();
                    roomList[i].totalCost = BillUtil.calculateRoomTotalCostInBill(ObjectUtil.getObject(roomList[i]), ObjectUtil.convertRuleToObject(rule));
                    totalBillCost += roomList[i].totalCost;
                }
                bill.totalCost = totalBillCost;
                res.render('bill/detail', {
                    bill: ObjectUtil.getObject(bill),
                    roomList: roomList.map((item) => ObjectUtil.getObject(item))
                });
            }
            else{
                next(createError(404));
            }
          
        } catch (error) {
            console.log(error);
            next(createError(500));
        }
    }
}

module.exports = new BillController();