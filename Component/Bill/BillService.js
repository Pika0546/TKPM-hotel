const { Op } = require("sequelize");

const { models } = require("../../models");
const guest = require('../../models/guest');

class BillService{
    getBillList = async (limit, page, guestName, rentDateFrom, rentDateTo, valueFrom, valueTo) => {
        console.log(rentDateFrom);
        console.log(rentDateTo);
        return models.bill.findAll({
            raw: true,
            offset: (page-1)*limit,
            limit: limit,
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