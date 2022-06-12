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
        const roomRentList = await BillService.getRoomBeingRentList();
        for (let i = 0; i < roomRentList.length; i++) {
            let rentdate = new Date(roomRentList[i].createdAt);
            let d = rentdate.getUTCDate().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
            let m = (rentdate.getUTCMonth() + 1).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
            let y = rentdate.getUTCFullYear().toString();
            roomRentList[i].rentdate = d + '/' + m + '/' + y;
        }
        let roomRentFirst = null;
        if (roomRentList.length > 0) {
            roomRentFirst = ObjectUtil.getObject(roomRentList[0]);
            roomRentFirst.rentdate = roomRentList[0].rentdate;
            const guestFirstList = await BillService.getGuestsByRoomRentId(roomRentFirst.id);
            roomRentFirst.guests = guestFirstList.map((item) => ObjectUtil.getObject(item));
            for (let i = 0; i < roomRentFirst.guests.length; i++) {
                roomRentFirst.guests[i].numorder = i + 1;
            }
            roomRentFirst.numRentDays = Math.ceil(DateUtil.convertMilisecondtoDay(Math.abs(new Date() - new Date(roomRentFirst.createdAt))));
            const rule = await BillService.getRule();
            roomRentFirst.totalCost = BillUtil.calculateRoomTotalCostInBill(roomRentFirst, ObjectUtil.convertRuleToObject(rule));
        }
        res.render('bill/add', {
            roomRentList: roomRentList.map((item) => ObjectUtil.getObject(item)),
            roomRentFirst,
            message: req.flash('create-bill-message')
        });
    }
    getAddModalBill = async (req, res, next) => {
        try {
            const roomRentId = parseInt(req.query.roomRentId) || null;
            const roomRent = await BillService.getRoomBeingRent(roomRentId);
            const createdAt = new Date(roomRent.createdAt);
            let d = createdAt.getUTCDate().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
            let m = (createdAt.getUTCMonth() + 1).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
            let y = createdAt.getUTCFullYear().toString();
            let rentdate = d + '/' + m + '/' + y;
            const guests = await BillService.getGuestsByRoomRentId(roomRentId);
            roomRent.guests = guests.map((item) => ObjectUtil.getObject(item));
            for (let i = 0; i < roomRent.guests.length; i++) {
                roomRent.guests[i].numorder = i + 1;
            }
            roomRent.numRentDays = Math.ceil(DateUtil.convertMilisecondtoDay(Math.abs(new Date() - createdAt)));
            const rule = await BillService.getRule();
            const totalCost = BillUtil.calculateRoomTotalCostInBill(ObjectUtil.getObject(roomRent), ObjectUtil.convertRuleToObject(rule));
            res.status(200).json({
                roomRentGuests: roomRent.guests,
                rentdate,
                numRentDays: roomRent.numRentDays,
                price: ObjectUtil.getObject(roomRent).room.roomtype.price,
                totalCost
            });
        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
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