const SiteService = require("./SiteService");
const ObjectUtil = require('../../utils/object');
const BillUtil = require('../../utils/bill');
class SiteController{

    fetchRoomTypeData = async (month,  year) => {
        if(!month || !year){
            month = new Date().getMonth() + 1;
            year = new Date().getFullYear();
        }
        
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        const roomRentDetailData = await SiteService.getRoomRentDetail(startDate, endDate);
        const n = roomRentDetailData.length;
        for(let i = 0 ; i < n ;i++){
            const guests = await SiteService.getRoomGuest(roomRentDetailData[i].id);
            roomRentDetailData[i].guests = guests.map(item=> ObjectUtil.getObject(item));
        }
        const ruleData = await SiteService.getRule();
        const rule = ObjectUtil.convertRuleToObject(ruleData);
        const roomTypeList = await SiteService.getRoomTypeList();
        const roomRentDetail = roomRentDetailData.map((item) => ObjectUtil.getObject(item));
        const resultRoomType = {};
        for(let i = 0; i < roomTypeList.length ; i++){
            resultRoomType[roomTypeList[i].typeName] = {value: 0}
        }
        let sum = 0;
        for(let i = 0 ; i < n ; i++){
            resultRoomType[roomRentDetail[i].room.roomtype.typeName].value += BillUtil.calculateRoomCost(roomRentDetail[i], rule);
            sum += resultRoomType[roomRentDetail[i].room.roomtype.typeName].value;
        }
        for(let i = 0; i < roomTypeList.length; i++){
            resultRoomType[roomTypeList[i].typeName].ratio = resultRoomType[roomTypeList[i].typeName].value/sum;
        }

        return resultRoomType
        
    }

    getHomePage = async (req, res, next) => {
        const resultRoomType = await this.fetchRoomTypeData();
        res.render('home', {resultRoomType, resultRoomTypeArr: Object.keys(resultRoomType).map(key=>({type:key, ...resultRoomType[key]}))})
        // res.status(200).json({resultRoomType});
        //res.status(200).json(roomRentDetailData);
    }


    getRoomTypeAPI = async (req, res, next) => {
        let month = req.query.month;
        let year = req.query.year;
        if(isNaN(month) || isNaN(year)){
            res.status(200).json({
                success: false,
                message: "Đầu vào không hợp lệ"
            });
            return;
        }
        month = parseInt(month);
        year = parseInt(year);
        if(month <= 0 || month >= 13 || year <= 1969 || year >= new Date().getFullYear() + 1){
            res.status(200).json({
                success: false,
                message: "Đầu vào không hợp lệ"
            });
            return;
        }
        try {
            const resultRoomType = await this.fetchRoomTypeData(month, year);
            res.status(200).json({
                success: true,
                data:{
                    resultRoomType
                }
            })
        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    }

    getLoginPage = async (req, res, next) => {
        res.render('login');
    }

    getForgotPasswordPage = async (req, res, next)=>{
        res.render('forgot-password');
    }
}

module.exports = new SiteController();