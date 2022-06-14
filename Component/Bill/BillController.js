const BillService = require('./BillService');
const createError = require('http-errors');
const PageUtil = require('../../utils/page');
const ObjectUtil = require('../../utils/object');

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
        totalBill = await BillService.countAllBill(guestName, rentDateStart, rentDateEnd, valueFrom, valueTo);
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
            console.log(billListData);
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
        res.render('bill/add');
    }
    getDetailBill = async (req, res, next) => {
        res.render('bill/detail');
    }
}

module.exports = new BillController();