const createError = require('http-errors');
const PageUtil = require('../../utils/page');
const DateUtil = require('../../utils/date');
const BillUtil = require('../../utils/bill');
const ObjectUtil = require('../../utils/object');

const BillService = require('./BillService');

const maximumPagination = 5;
let currentPage = 1;
let totalPage = 1;
let totalBill = 0;
const limit = 5;

class BillController{
    fetchBillListFromDB = async (req, res, next) => {
        const pageNumber = req.query.page;
        const guestName = req.query.guest || null;
        const rentDateFrom = req.query.rentDateFrom || null;
        const rentDateTo = req.query.rentDateTo || null;
        const valueFrom = req.query.valueFrom || null;
        const valueTo = req.query.valueTo || null;
        let rentDateStart = null;
        let rentDateEnd = null;
        if(rentDateFrom){
            let dateFrom = rentDateFrom.split('/');
            rentDateStart = new Date(dateFrom[2]+'-'+dateFrom[1]+'-'+dateFrom[0]+'T00:00:00Z');
        }
        if(rentDateTo){
            let dateTo = rentDateTo.split('/');
            rentDateEnd = new Date(dateTo[2]+'-'+dateTo[1]+'-'+dateTo[0]+'T23:59:59Z');
        }
        currentPage = PageUtil.getCurrentPage(pageNumber, totalPage);
        const bill = await BillService.getBillList(limit, currentPage, guestName, rentDateStart, rentDateEnd, valueFrom, valueTo);
        totalBill = await BillService.countAllBillVer2(guestName, rentDateStart, rentDateEnd, valueFrom, valueTo);
        totalPage = Math.ceil(totalBill/limit);
        const paginationArray = PageUtil.getPaginationArray(currentPage, totalPage, maximumPagination);
        let billLength = Object.keys(bill).length;
        for(let i=0; i<billLength; i++){
            let date = new Date(bill[i].createdAt);
            let d = date.getUTCDate().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
            let m = (date.getUTCMonth() + 1).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
            let y = date.getUTCFullYear().toString();
            bill[i].billDate = d + '/' + m + '/' + y;
            bill[i].stt = (currentPage-1)*limit+i+1;
        }
        return{
            bill: bill.map((item) => ObjectUtil.getObject(item)),
            page: currentPage,
            totalPage,
            totalBill,
            limit,
            paginationArray,
            queryBill: guestName,
            queryRentDateFrom: rentDateFrom,
            queryRentDateTo: rentDateTo,
            queryValueFrom: valueFrom,
            queryValueTo: valueTo,
            prevPage: (currentPage > 1) ? currentPage - 1 : 1,
            nextPage: (currentPage < totalPage) ? currentPage + 1 : totalPage,
        }
    }

    getBillList = async (req, res, next) => {
        try{
            const billListData = await this.fetchBillListFromDB(req, res, next);
            res.render('bill/list', billListData);
        }catch(error){
            console.log(error);
            next(createError(500));
        } 
    }

    getBillListApi = async (req, res, next) => {
        try{
            const billListData = await this.fetchBillListFromDB(req, res, next);
            res.status(200).json(billListData);
        }catch(error){
            console.log(error);
            res.status(500).json(error);
        }
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
				req.flash('create-bill-message', {success: false, message: "B???n c???n ??i???n ????? th??ng tin v??o c??c tr?????ng!"});
                res.redirect("/bill/add");
			}
			else if (roomRents.length === 0){
				req.flash('create-bill-message', {success: false, message: "Danh s??ch ph??ng thanh to??n tr???ng!"});
                res.redirect("/bill/add");
			}
            else{
                for (let i = 0; i < roomRents.length; i++)
                {
                    const roomrentDB = await BillService.getRoomRentById(roomRents[i].id);
                    if (!roomrentDB) {
                        req.flash('create-bill-message', {success: false, message: "Ph??ng thu?? kh??ng t???n t???i!"});
                        res.redirect("/bill/add");
                        return;
                    }
                    else if (roomrentDB.billId) {
                        req.flash('create-bill-message', {success: false, message: "Ph??ng thu?? ???? ???????c thanh to??n!"});
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
                req.flash('create-bill-message', {success: true, message: "Thanh to??n h??a ????n m???i th??nh c??ng!"});
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
            // const bill = await BillService.findBillById(billId);
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