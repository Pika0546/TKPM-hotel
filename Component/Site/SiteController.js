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
            sum += BillUtil.calculateRoomCost(roomRentDetail[i], rule);
        }
        for(let i = 0; i < roomTypeList.length; i++){
            resultRoomType[roomTypeList[i].typeName].ratio = resultRoomType[roomTypeList[i].typeName].value/sum;
        }

        return resultRoomType
        
    }

    fetchRoomDensityData = async (month, year) => {
        if(!month || !year){
            month = new Date().getMonth() + 1;
            year = new Date().getFullYear();
        }
        
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);

        const roomRentDetailData = await SiteService.getRoomRentDetail(startDate, endDate);
        const allRoom = await SiteService.getRoomList();
        const n = roomRentDetailData.length;
        const roomRentDetail = roomRentDetailData.map((item) => ObjectUtil.getObject(item));

        const resultRoomDensity = {};
        allRoom.forEach(room=>{
            resultRoomDensity[room.roomId] = {value: 0};
        })

        let sum = 0;
        for(let i = 0; i < n ;i++){
            resultRoomDensity[roomRentDetail[i].room.roomId].value += 1;
            sum += 1;
        }

        allRoom.forEach(room=>{
            resultRoomDensity[room.roomId].ratio = resultRoomDensity[room.roomId].value/sum;
        })
        return resultRoomDensity;
    }

    getHomePage = async (req, res, next) => {
        const resultRoomType = await this.fetchRoomTypeData();
        const resultRoomDensity = await this.fetchRoomDensityData();
        res.render('home', {
            resultRoomType, 
            resultRoomTypeArr: Object.keys(resultRoomType).map(key=>({type:key, ...resultRoomType[key]})),
            resultRoomDensity,
            resultRoomDensityArr: Object.keys(resultRoomDensity).map(key=>({room:key, ...resultRoomDensity[key]})),
        })
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

    getRoomDenstityAPI = async (req, res, next) => {
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
            const resultRoomDensity = await this.fetchRoomDensityData(month, year);
            res.status(200).json({
                success: true,
                data:{
                    resultRoomDensity
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