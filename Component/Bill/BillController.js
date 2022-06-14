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
        try {
            const roomRentId = req.query.room || null;
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
                roomRentId,
                roomRentList: roomRentList.map((item) => ObjectUtil.getObject(item)),
                roomRentFirst,
                message: req.flash('create-bill-message')
            });
        } catch (error) {
            console.log(error);
            next(createError(500));
        }
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

    createBill = async (req, res, next) => {
        try{
            const guestName = req.body.guestName || null;
            const guestAddress = req.body.guestAddress || null;
            const roomRents = JSON.parse(req.body.roomRentsJson || null);
            
            if (!guestName || !guestAddress){
				req.flash('create-bill-message', {success: false, message: "Bạn cần điền đủ thông tin vào các trường!"});
                res.redirect("/bill/add");
			}
			else if (roomRents.length === 0){
				req.flash('create-bill-message', {success: false, message: "Danh sách phòng thanh toán trống!"});
                res.redirect("/bill/add");
			}
            else{
                for (let i = 0; i < roomRents.length; i++)
                {
                    const roomrentDB = await BillService.getRoomRentById(roomRents[i].id);
                    if (!roomrentDB) {
                        req.flash('create-bill-message', {success: false, message: "Phòng thuê không tồn tại!"});
                        res.redirect("/bill/add");
                        return;
                    }
                    else if (roomrentDB.billId) {
                        req.flash('create-bill-message', {success: false, message: "Phòng thuê đã được thanh toán!"});
                        res.redirect("/bill/add");
                        return;
                    }
                }

                const guest = {fullname: guestName, address: guestAddress};
                const newGuest = await BillService.createGuest(guest);
                const newBill = await BillService.createBill(newGuest.id);
                for (let i = 0; i < roomRents.length; i++){
                    const roomrent = await BillService.updateBillOfRoomRent(roomRents[i].id, newBill.id);
                    const room = await BillService.updateStatusOfVacancyRoom(roomRents[i].roomId);
                }
                req.flash('create-bill-message', {success: true, message: "Thanh toán hóa đơn mới thành công!"});
                res.redirect(`/bill/${newBill.id}`);
            }
        } catch (error) {
            console.log(error);
            next(createError(500));
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
                    roomList: roomList.map((item) => ObjectUtil.getObject(item)),
                    message: req.flash('create-bill-message')
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