const createError = require('http-errors');

const RuleService = require('./RuleService');
const PageUtil = require('../../utils/page');
const ObjectUtil = require('../../utils/object');

const maximumPagination = 5;
const limit = 5;

let currentGuestTypePage = 1;
let totalGuestTypePage = 1;
let totalGuestType = 0;

let currentRoomTypePage = 1;
let totalRoomTypePage = 1;
let totalRoomType = 0;

class RuleController{
    getRulePage = async (req, res, next) => {
        let pageNumber = req.query.page;
        let rule = {};
        currentGuestTypePage = PageUtil.getCurrentPage(pageNumber, totalGuestTypePage);
        rule.guestTypes = await RuleService.getGuestTypeList(limit, currentGuestTypePage);
        rule.roomTypes = await RuleService.getRoomTypeList(limit, currentGuestTypePage);
        const otherRule = await RuleService.getRule()
        rule = {...rule, ...ObjectUtil.convertRuleToObject(otherRule)}
        res.render('rule/index', {rule})
        
    } 

    addGuestTypeApi = async (req, res, next) => {
        const {name, coefficient} = req.body;
        if(!name || !coefficient || isNaN(coefficient)){
            res.status(200).json({
                success: false,
                message: "Đầu vào không hợp lệ"
            });
            return;
        }
        try {
            const other = await RuleService.findGuestTypeByName(name);
            if(other){
                res.status(200).json({
                    success: false,
                    message: "Loại khách đã tồn tại"
                });
                return;
            }

            const newGuestType = await RuleService.createGuestType(name, parseFloat(coefficient));
            res.status(200).json({
                success: true,
                message: "Thêm loại khách thành công",
                data: newGuestType
            });
            return;
        } catch (error) {
            res.status(500).json(error);
        }

    }
}

module.exports = new RuleController();