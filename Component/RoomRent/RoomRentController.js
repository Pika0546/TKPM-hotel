const createError = require('http-errors');
const PageUtil = require('../../utils/page');
const ObjectUtil = require('../../utils/object');

const RoomRentService = require('./RoomRentService');
const RoomService = require('../Room/RoomService');
const models = require('../../models');
const RuleService = require('../Rule/RuleService');
const guest = require('../../models/guest');

const maximumPagination = 5;
let currentPage = 1;
let totalPage = 1;
let totalRoom = 0;
const limit = 5;

class RoomRentController{
    fetchRoomRentListFromDB = async (req, res, next) => {
        const pageNumber = req.query.page;
        const roomId = req.query.room || null;
        const rentDateFrom = req.query.rentDateFrom || null;
        let rentDateStart = null;
        if (rentDateFrom)
        {
            let dateFrom = rentDateFrom.split('/');
            rentDateStart = new Date(dateFrom[2]+'-'+dateFrom[1]+'-'+dateFrom[0]+'T00:00:00Z');
        }
        const rentDateTo = req.query.rentDateTo || null;
        let rentDateEnd = null;
        if (rentDateTo)
        {
            let dateTo = rentDateTo.split('/');
            rentDateEnd = new Date(dateTo[2]+'-'+dateTo[1]+'-'+dateTo[0]+'T23:59:59Z');
        }
        const status = req.query.status || null;
        currentPage = PageUtil.getCurrentPage(pageNumber, totalPage);
        const roomrent = await RoomRentService.getRoomRentList(limit, currentPage, roomId, rentDateStart, rentDateEnd, status);
        totalRoom = await RoomRentService.countAllRoom(roomId, rentDateStart, rentDateEnd, status);
        totalPage = Math.ceil(totalRoom/limit);
        const paginationArray = PageUtil.getPaginationArray(currentPage, totalPage, maximumPagination);
        let roomrentLen = Object.keys(roomrent).length;
        for (let i = 0; i < roomrentLen; i++) {
            let date = new Date(roomrent[i].createdAt);
            let d = date.getUTCDate().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
            let m = (date.getUTCMonth() + 1).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
            let y = date.getUTCFullYear().toString();
            roomrent[i].rentDate = d + '/' + m + '/' + y;
        }
        return {
            roomrent: roomrent.map((item) => ObjectUtil.getObject(item)),
            page: currentPage,
            totalPage,
            totalRoom,
            paginationArray,
            queryRoom: roomId,
            queryRentDateFrom: rentDateFrom,
            queryRentDateTo: rentDateTo,
            queryStatus: status,
            prevPage: (currentPage > 1) ? currentPage - 1 : 1,
            nextPage: (currentPage < totalPage) ? currentPage + 1 : totalPage,
        }
    }

    getRoomRentList = async (req, res, next) => {
        try {
            const roomRentListData = await this.fetchRoomRentListFromDB(req, res, next);
            res.render('roomrent/list', roomRentListData);
        } catch (error) {
            console.log(error);
            next(createError(500));
        }
    }

    getRoomRentListApi = async (req, res, next) => {
        try {
            const roomRentListData = await this.fetchRoomRentListFromDB(req, res, next);
            res.status(200).json(roomRentListData);
        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    }

    getAddRoomRent = async (req, res, next) => {
        //lấy guesttype
        try{
            const maximumGuest = await RuleService.getRuleByKey("maximumGuest");
            const guestType = await RoomRentService.getGuestTypeList();
            const roomName = req.query.room;
            res.render('roomrent/add', {
            maximumGuest,
            guestType,
            roomName,
            message: req.flash("add-rent")
        });
        }
        catch(error){
            console.log(error);
            next(createError(500));
        }
    }

    getDetailRoomRent = async (req, res, next) => {
        try{
            const guestType = await RoomRentService.getGuestTypeList();
            const roomrentId = req.params.id;
            const guests = await RoomRentService.getGuetsByRoomRentId(roomrentId);
            for(let i=0; i<guests.length; i++){
                for(let j=0; j <guestType.length; j++){
                    if(guests[i].typeId === guestType[j].id){
                        guests[i].typeName = guestType[j].typeName;
                        break;
                    }
                }
            }
            console.log(guests);
            res.render('roomrent/edit',{
                roomrentId,
                guests,
                message: req.flash("edit-rent")
            });
        }catch(error){
            console.log(error);
            next(createError(500));
        }   
    }

    createRoomRent = async (req, res, next) => {
        //console.log(req.body.room);
        try {
            const maximumGuest = await RuleService.getRuleByKey("maximumGuest");
            const roomId = req.body.room;///mã phòng
            
            const guests = JSON.parse(req.body.guests);

            //check room có tồn tại kh
            const room = await RoomService.getRoomByRoomId(parseInt(roomId));
            console.log(room);
            if(!room){
                req.flash('add-rent', {success:false, message: "Phòng không tồn tại!"});
                res.redirect(`/rent`)
                return;
            }
            // check danh sách rỗng
            if(guests.length === 0){
                req.flash('add-rent', {success:false, message: "Danh sách khách trống!"});
                res.redirect(`/rent/add?room=${roomId}`)
                return;
            }
            // check vượt quá tối đa
            if(guests.length > parseInt(maximumGuest)){
                req.flash('add-rent', {success:false, message: "Danh sách khách vượt quá số lượng tối đa!"});
                res.redirect(`/rent/add?room=${roomId}`)
                return;
            }
            // check dữ liệu rỗng
            for(let i=0; i<guests.length; i++){
                let g = guests[i];
                if(!g || !g.guestName || !g.guestName.length || 
                    !g.guestType || !g.guestType.length || 
                    !g.guestId || !g.guestId.length || 
                    !g.address || !g.address.length){
                    req.flash('add-rent', {success:false, message: "Đầu vào không hợp lệ!"});
                    res.redirect(`/rent/add?room=${roomId}`)
                    return;
                }
            }
            //create room rent
            let roomRent = await RoomRentService.createRoomRent(room.id);
            const n = guests.length;
            for(let i = 0 ; i < n; i++){
                guests[i].roomRentId = roomRent.id;
                let guest = await RoomRentService.createGuest(guests[i])
            }
            //cập nhật tình trạng phòng khi thuê thành công
            RoomService.updateRoomStatus(room.id, "Đang thuê");

            req.flash("edit-rent", {success: true, message: "Thêm phiếu thuê thành công!"})
            //console.log("Thêm thành công!")
            res.redirect(`/rent/edit/${roomRent.id}`);
        } catch (error) {
            console.log(error);
            next(createError(500));
        }    
    }


    deleteRoomRentAPI = async (req, res, next) => {
        try {
            const {id} = req.params;
            if(!id){
                res.status(200).json({
                    success: false,
                    message: "Đầu vào không hợp lệ!"
                });
                return;
            }
            const resData = await RoomRentService.findRoomRentById(id);
            console.log(resData)
            if(!resData){
                res.status(200).json({
                    success: false,
                    message: "Phiếu thuê không tồn tại!"
                });
                return;
            }
            if(!resData.billId){
                res.status(200).json({
                    success: false,
                    message: "Không thể xóa: Phiếu thuê này chưa được thanh toán!"
                });
                return;
            }
            const resData2 = await RoomRentService.deleteRoomRentById(id);
            res.status(200).json({
                success: true,
                roomRent: resData2,
                message: 'Xóa thành công!'
            })
            return;

        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    }
}

module.exports = new RoomRentController();