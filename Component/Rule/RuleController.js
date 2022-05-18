const createError = require('http-errors');

const RuleService = require('./RuleService');
const PageUtil = require('../../utils/page');
const ObjectUtil = require('../../utils/object');

class RuleController{
    getRulePage = async (req, res, next) => {
        let rule = {};
        rule.guestTypes = await RuleService.getGuestTypeList();
        rule.roomTypes = await RuleService.getRoomTypeList();
        const otherRule = await RuleService.getRule();
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

    editGuestTypeApi = async (req, res, next) => {
        const {name, coefficient, id} = req.body;
        if(!id || !name || !coefficient || isNaN(coefficient)){
            res.status(200).json({
                success: false,
                message: "Đầu vào không hợp lệ"
            });
            return;
        }
        try {
            const rule = await RuleService.findGuestTypeById(id);
            if(!rule){
                res.status(200).json({
                    success: false,
                    message: "Không tồn tại"
                });
                return;
            }
            const other = await RuleService.findGuestTypeByName(name);
            if(other.id !== rule.id){
                res.status(200).json({
                    success: false,
                    message: "Loại khách đã tồn tại"
                });
                return;
            }

            const newGuestType = await RuleService.updateGuestType(id, name, parseFloat(coefficient));
            res.status(200).json({
                success: true,
                message: "Cập nhật loại khách thành công",
                data: newGuestType
            });
            return;
        } catch (error) {
            res.status(500).json(error);
        }

    }

    deleteGuestTypeApi = async (req, res, next) => {
        const {id} = req.body;
        if(!id){
            res.status(200).json({
                success: false,
                message: "Đầu vào không hợp lệ"
            });
            return;
        }
        try {
            const rule = await RuleService.findGuestTypeById(id);
            if(!rule){
                res.status(200).json({
                    success: false,
                    message: "Không tồn tại"
                });
                return;
            }

            const newGuestType = await RuleService.deleteGuestType(id);
            res.status(200).json({
                success: true,
                message: "Xóa loại khách thành công",
                data: newGuestType
            });
            return;
        } catch (error) {
            res.status(500).json(error);
        }

    }


    addRoomTypeApi = async (req, res, next) => {
        const {name, price} = req.body;
        if(!name || !price || isNaN(price)){
            res.status(200).json({
                success: false,
                message: "Đầu vào không hợp lệ"
            });
            return;
        }
        try {
            const other = await RuleService.findRoomTypeByName(name);
            if(other){
                res.status(200).json({
                    success: false,
                    message: "Loại phòng đã tồn tại"
                });
                return;
            }

            const newRoomType = await RuleService.createRoomType(name, parseInt(price));
            res.status(200).json({
                success: true,
                message: "Thêm loại phòng thành công",
                data: newRoomType
            });
            return;
        } catch (error) {
            res.status(500).json(error);
        }

    }

    editRoomTypeApi = async (req, res, next) => {
        const {name, price, id} = req.body;
        if(!id || !name || !price || isNaN(price)){
            res.status(200).json({
                success: false,
                message: "Đầu vào không hợp lệ"
            });
            return;
        }
        try {
            const rule = await RuleService.findRoomTypeById(id);
            if(!rule){
                res.status(200).json({
                    success: false,
                    message: "Không tồn tại"
                });
                return;
            }
            const other = await RuleService.findRoomTypeByName(name);
            if(other.id !== rule.id){
                res.status(200).json({
                    success: false,
                    message: "Loại phòng đã tồn tại"
                });
                return;
            }

            const newRoomType = await RuleService.updateRoomType(id, name, parseInt(price));
            res.status(200).json({
                success: true,
                message: "Cập nhật loại phòng thành công",
                data: newRoomType
            });
            return;
        } catch (error) {
            res.status(500).json(error);
        }

    }

    deleteRoomTypeApi = async (req, res, next) => {
        const {id} = req.body;
        if(!id){
            res.status(200).json({
                success: false,
                message: "Đầu vào không hợp lệ"
            });
            return;
        }
        try {
            const rule = await RuleService.findRoomTypeById(id);
            if(!rule){
                res.status(200).json({
                    success: false,
                    message: "Không tồn tại"
                });
                return;
            }

            const newGuestType = await RuleService.deleteRoomType(id);
            res.status(200).json({
                success: true,
                message: "Xóa loại phòng thành công",
                data: newGuestType
            });
            return;
        } catch (error) {
            res.status(500).json(error);
        }
    }

    updateMaximumGuest = async (req, res, next) => {
        let {maximumGuest} = req.body;
        try {
            if(isNaN(maximumGuest)){
                res.status(200).json({
                    success: false,
                    message: "Đầu vào không hợp lệ"
                });
                return;
            }
            maximumGuest = parseInt(maximumGuest);
            let commonRule = await RuleService.getRule();
            commonRule = ObjectUtil.convertRuleToObject(commonRule);
            if(maximumGuest < parseInt(commonRule.surchargeFrom)){
                res.status(200).json({
                    success: false,
                    message: "Lượng khách tối đa không thể bé hơn khách bắt đầu phụ thu"
                });
                return;
            }
            const resData = await RuleService.updateCommonRule("maximumGuest", maximumGuest);
            res.status(200).json({
                success: true,
                message: "Cập nhật khách tối đa thành công",
                data: resData
            });
        } catch (error) {
            console.log(error)
            res.status(500).json(error);
        }
    }

    updateSurcharge = async (req, res, next)=>{
        let {surcharge, surchargeFrom} = req.body;
        try {
            console.log(surcharge, surchargeFrom)
            if(isNaN(surchargeFrom) || isNaN(surcharge)){
                res.status(200).json({
                    success: false,
                    message: "Đầu vào không hợp lệ"
                });
                return;
            }
            surcharge = parseFloat(surcharge);
            surchargeFrom = parseInt(surchargeFrom);
            let commonRule = await RuleService.getRule();
            commonRule = ObjectUtil.convertRuleToObject(commonRule);
            if(surchargeFrom > parseInt(commonRule.maximumGuest)){
                res.status(200).json({
                    success: false,
                    message: "Khách bắt đầu phụ thu không thể lớn hơn khách tối đa"
                });
                return;
            }
            const res1 = await RuleService.updateCommonRule("surcharge", surcharge);
            const res2 = await RuleService.updateCommonRule("surchargeFrom", surchargeFrom);
            res.status(200).json({
                success: true,
                message: "Cập nhật tỉ lệ phụ thu thành công",
                data: [res1, res2]
            });
        } catch (error) {
            console.log(error)
            res.status(500).json(error);
        }
    }
}

module.exports = new RuleController();