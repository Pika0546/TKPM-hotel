const  { Op, QueryTypes, Sequelize } = require("sequelize");

const { models, sequelize } = require("../../models");
const guest = require('../../models/guest');
const BillUtil = require('../../utils/bill');
const ObjectUtil = require('../../utils/object');
const { getGuetsByRoomRentId } = require("../RoomRent/RoomRentService");

class BillService{
    getAllBillList = async (guestName, rentDateFrom, rentDateTo, valueFrom, valueTo) => {
        return models.bill.findAll({
            raw: true,
            where:{
                ...(rentDateFrom && rentDateTo && rentDateFrom.length && rentDateTo.length && {createdAt: {[Op.between]: [rentDateFrom, rentDateTo]}}),
                //...(valueFrom && valueTo.length && {value: {[Op.between]: [valueFrom, valueTo]}}),
            },
            include:[
                {
                    model: models.guest,
                    where:{
                        ...(guestName && guestName.length && {fullname: {[Op.substring]:guestName}})
                    },
                    require: true
                },
            ]
        })
    }
    getBillList = async (limit, page, guestName, rentDateFrom, rentDateTo, valueFrom, valueTo) => {
        let billList = await this.getBillListNoValue(limit, page, guestName, rentDateFrom, rentDateTo);
        let rule = await this.getRule();
        let ruleObject = BillUtil.ruleDBToObject(rule);

        for(let  i=0; i<billList.length; i++){
            let listRoomRent = await sequelize.query(
                `SELECT bill.id AS billId, roomrent.id AS roomrentId,
                roomrent.roomId, COUNT(*) AS guestsLength,
                roomrent.createdAt AS rentDate, bill.createdAt AS returnDate,
                roomtype.price
                FROM bill INNER JOIN roomrent ON bill.id = roomrent.billId
                INNER JOIN room ON room.id = roomrent.roomId
                INNER JOIN roomtype ON room.typeId = roomtype.id
                INNER JOIN guest ON guest.roomRentId = roomrent.id
                WHERE bill.id = ? AND guest.deletedAt IS NULL
                GROUP BY bill.id, roomrent.id, roomrent.createdAt, bill.createdAt,
                roomtype.price, roomrent.roomId`,
                {
                    raw: true,
                  replacements: [billList[i].id],
                  type: QueryTypes.SELECT
                }
            );
            for(let i=0; i<listRoomRent.length; i++){
                let guests = await getGuetsByRoomRentId(listRoomRent[i].roomrentId);
                for(let i=0; i<guests.length; i++){
                    guests[i] = ObjectUtil.getObject(guests[i]);
                }
                listRoomRent[i].guests = guests;
            }
            let totalCost = 0;
            if(listRoomRent && listRoomRent.length){
                for(let j=0; j<listRoomRent.length; j++){
                    totalCost+=BillUtil.calcRoomCost(listRoomRent[j], ruleObject);
                }
            }
            billList[i].cost = totalCost;
            billList[i].costVND = BillUtil.numberToVnd(totalCost);
        }
        //
        if(!valueFrom && !valueTo){
            return billList;
        }
        valueFrom = BillUtil.vndToNumber(valueFrom);
        valueTo = BillUtil.vndToNumber(valueTo);

        return billList.filter(function(bill){
            return bill.cost >=valueFrom && bill.cost<=valueTo;
        });
    }

    getBillListNoValue = async (limit, page, guestName, rentDateFrom, rentDateTo) => {
        return models.bill.findAll({
            raw: true,
            offset: (page-1)*limit,
            // limit: limit,
            where:{
                ...(rentDateFrom && rentDateTo && {createdAt: {[Op.between]: [rentDateFrom, rentDateTo]}}),
                //...(valueFrom && valueTo && {value: {[Op.between]: [valueFrom, valueTo]}})
            },
            include:[
                {
                    model: models.guest,
                    where:{
                        ...(guestName && guestName.length && {fullname: {[Op.substring]:guestName}})
                    },
                    require: true
                },
            ]
        })
    }

    getRule = async () => {
        return models.rule.findAll({
            raw: true
        })
    }

    getRoomBeingRentList = async () => {
        return models.roomrent.findAll({
            raw: true,
            where:{
                billId:{
                    [Op.is]: null
                }
            },
            include: [
                {
                    model: models.room,
                    attributes: ['id', 'roomId', 'typeId'],
                    require: true,
                    include: [
                        {
                            model: models.roomtype,
                            attributes:['price'],
                            require: true
                        }
                    ]
                }
            ],
            order: [
                [models.room, 'roomId', 'ASC']
            ]
        })
    }
    getRoomRent = async (billId, roomId) => {//dk roomrent thanh toan toan roi
        return models.roomrent.findOne({

        })
    }

    getListRoomRentByBillId = async (id) => {

        return models.roomrent.findAll({
            raw:true,
            where:{
                billId:id
            },
            include:[
                {
                    model: models.bill,
                    where:{
                        id:id
                    },
                    require: true,
                },    
            ]
        })
    }

    getRoomBeingRent = async (roomRentId) => {
        return models.roomrent.findOne({
            raw: true,
            where:{
                id: roomRentId
            },
            include: [
                {
                    model: models.room,
                    attributes: ['id', 'roomId', 'typeId'],
                    require: true,
                    include: [
                        {
                            model: models.roomtype,
                            attributes:['price'],
                            require: true
                        }
                    ]
                }
            ],
            order: [
                [models.room, 'roomId', 'ASC']
            ]
        })
    }
    getRule = async () => {
        return models.rule.findAll();
    }

    countAllBill = async (guestName, rentDateFrom, rentDateTo, valueFrom, valueTo) => {
        return models.bill.count({
            where:{
                ...(rentDateFrom && rentDateTo && rentDateFrom.length && rentDateTo.length && {createdAt: {[Op.between]: [rentDateFrom, rentDateTo]}}),
                //...(valueFrom && valueTo.length && {value: {[Op.between]: [valueFrom, valueTo]}}),
            },
            include:[
                {
                    model: models.guest,
                    where:{
                        ...(guestName && guestName.length && {fullname: {[Op.substring]:guestName}})
                    },
                    require: true
                },
            ]
        })
    }

    getRoomRentById = async (id) => {
        return models.roomrent.findOne({
            raw: true,
            where:{
                id: id
            }
        })
    }

    createGuest = async (guest) => {
        return models.guest.create({
            fullname: guest.fullname,
            address: guest.address
        });
    }

    createBill = async (guestId) => {
        return models.bill.create({
            guestId: guestId
        });
    }

    updateBillOfRoomRent = async (roomRentId, billId) => {
        return models.roomrent.update(
            {
                billId: billId
            },
            {
                where: {
                    id: roomRentId
                }
            }
        )
    }

    updateStatusOfVacancyRoom = async (roomId) => {
        return models.room.update(
            {
                status: "Trống"
            },
            {
                where: {
                    roomId: roomId
                }
            }
        )
    }
    countAllBillVer2 = async (guestName, rentDateFrom, rentDateTo, valueFrom, valueTo) => {
        let billList = await models.bill.findAll({
            raw: true,
            where:{
                ...(rentDateFrom && rentDateTo && {createdAt: {[Op.between]: [rentDateFrom, rentDateTo]}}),
                //...(valueFrom && valueTo && {value: {[Op.between]: [valueFrom, valueTo]}})
            },
            include:[
                {
                    model: models.guest,
                    where:{
                        ...(guestName && guestName.length && {fullname: {[Op.substring]:guestName}})
                    },
                    require: true
                },
            ]
        });

        billList = billList.map(item => ObjectUtil.getObject(item)) ;

        let rule = await this.getRule();
        let ruleObject = BillUtil.ruleDBToObject(rule);

        for(let  i=0; i<billList.length; i++){
            let listRoomRent = await sequelize.query(
                `SELECT bill.id AS billId, roomrent.id AS roomrentId,
                roomrent.roomId, COUNT(*) AS guestsLength,
                roomrent.createdAt AS rentDate, bill.createdAt AS returnDate,
                roomtype.price
                FROM bill INNER JOIN roomrent ON bill.id = roomrent.billId
                INNER JOIN room ON room.id = roomrent.roomId
                INNER JOIN roomtype ON room.typeId = roomtype.id
                INNER JOIN guest ON guest.roomRentId = roomrent.id
                WHERE bill.id = ? AND guest.deletedAt IS NULL
                GROUP BY bill.id, roomrent.id, roomrent.createdAt, bill.createdAt,
                roomtype.price, roomrent.roomId`,
                {
                    raw: true,
                    replacements: [billList[i].id],
                    type: QueryTypes.SELECT
                }
            );
            for(let i=0; i<listRoomRent.length; i++){
                let guests = await getGuetsByRoomRentId(listRoomRent[i].roomrentId);
                for(let i=0; i<guests.length; i++){
                    guests[i] = ObjectUtil.getObject(guests[i]);
                }
                listRoomRent[i].guests = guests;
            }
            let totalCost = 0;
            if(listRoomRent && listRoomRent.length){
                for(let j=0; j<listRoomRent.length; j++){
                    totalCost+=BillUtil.calcRoomCost(listRoomRent[j], ruleObject);
                }
            }
            billList[i].cost = totalCost;
            billList[i].costVND = BillUtil.numberToVnd(totalCost);
        }
        //
        if(!valueFrom && !valueTo){
            return billList.length;
        }
        valueFrom = BillUtil.vndToNumber(valueFrom) || 0;
        valueTo = BillUtil.vndToNumber(valueTo) || 5000000;

        billList = billList.filter(function(bill){
            return bill.cost>=valueFrom && bill.cost<=valueTo;
        });
        return (billList.length || 0);
    }

    findBillById = async (id) => {
        return models.bill.findOne({
            raw: true,
            where: {
                id:id
            }
        })
    }

    deleteBillById = async (id) => {
        return models.bill.destroy({
            where:{
                id:id
            }
        })
    }
}

module.exports = new BillService();