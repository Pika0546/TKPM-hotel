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
            roomrent[i].numorder = i + 1 + ((currentPage - 1) * limit);
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
        //l???y guesttype
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
            const maximumGuest = await RuleService.getRuleByKey("maximumGuest");
            const guestType = await RoomRentService.getGuestTypeList();
            const roomrentId = parseInt(req.params.id);
            const roomrent = await RoomRentService.findRoomRentById(roomrentId);
            if(roomrent){
                next(createError(404));
                return;
            }
            const room = await RoomRentService.getRoomByRoomRentId(roomrentId);
            const guests = await RoomRentService.getGuetsByRoomRentId(roomrentId);
            for(let i=0; i<guests.length; i++){
                for(let j=0; j <guestType.length; j++){
                    if(guests[i].typeId === guestType[j].id){
                        guests[i].typeName = guestType[j].typeName;
                        break;
                    }
                }
                guests[i].stt = i + 1;
            }
            //console.log(guests);
            res.render('roomrent/edit',{
                roomrentId,
                maximumGuest,
                guestType,
                guests,
                room,
                time: roomrent.createdAt,
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
            const roomId = req.body.room;///m?? ph??ng
            const guests = JSON.parse(req.body.guests);

            //check room Id c?? t???n t???i kh??ng
            if(!roomId || !roomId.length || Number.isNaN(+roomId)){
                req.flash('add-rent', {success:false, message: "Ch??a c?? th??ng tin ph??ng!"});
                res.redirect(`/rent`)
                return;
            }
            //check room c?? t???n t???i kh??ng
            const room = await RoomService.getRoomByRoomId(parseInt(roomId));
            //console.log(room);
            if(!room){
                req.flash('add-rent', {success:false, message: "Ph??ng kh??ng t???n t???i!"});
                res.redirect(`/rent`)
                return;
            }
            //check tr???ng th??i room
            if(room.status === "??ang thu??"){
                req.flash('add-rent', {success:false, message: "Ph??ng ??ang ???????c thu??!"});
                res.redirect(`/rent`)
                return;
            }
            // check d??? li???u r???ng cho guests
            for(let i=0; i<guests.length; i++){
                let g = guests[i];
                if(!g || !g.guestName || !g.guestName.length || 
                    !g.guestType || !g.guestType.length || 
                    !g.guestId || !g.guestId.length || 
                    !g.address || !g.address.length){
                    req.flash('add-rent', {success:false, message: "?????u v??o kh??ng h???p l???!"});
                    res.redirect(`/rent/add?room=${roomId}`)
                    return;
                }
            }
            // check danh s??ch r???ng
            if(guests.length === 0){
                req.flash('add-rent', {success:false, message: "Danh s??ch kh??ch tr???ng!"});
                res.redirect(`/rent/add?room=${roomId}`)
                return;
            }
            // check v?????t qu?? t???i ??a
            if(guests.length > parseInt(maximumGuest)){
                req.flash('add-rent', {success:false, message: "Danh s??ch kh??ch v?????t qu?? s??? l?????ng t???i ??a!"});
                res.redirect(`/rent/add?room=${roomId}`)
                return;
            }
            //create room rent
            let roomRent = await RoomRentService.createRoomRent(room.id);
            const n = guests.length;
            for(let i = 0 ; i < n; i++){
                guests[i].roomRentId = roomRent.id;
                let guest = await RoomRentService.createGuest(guests[i])
            }
            //c???p nh???t t??nh tr???ng ph??ng khi thu?? th??nh c??ng
            RoomService.updateRoomStatus(room.id, "??ang thu??");

            req.flash("edit-rent", {success: true, message: "Th??m phi???u thu?? th??nh c??ng!"})
            res.redirect(`/rent/${roomRent.id}`);
        } catch (error) {
            console.log(error);
            next(createError(500));
        }    
    }

    updateRoomRentAPI = async (req, res, next) => {
        try{
            const roomrentId = parseInt(req.params.id);
            let {maximumGuest, room, guests} = req.body;
            room = JSON.parse(room);
            guests = JSON.parse(guests);

            //check room Id
            if(!room || Number.isNaN(+room.id)){
                res.status(200).json({
                    success: false,
                    message: "Ph??ng kh??ng h???p l???!"
                });
                return;
            }

            //check room c?? t???n t???i kh??ng
            const roomDB = await RoomService.getRoomByRoomId(room.roomId);
            if(!roomDB){
                res.status(200).json({
                    success: false,
                    message: "Ph??ng kh??ng t???n t???i!"
                });
                return;
            }

            //check room status c?? ??ang thu?? kh??ng
            if(roomDB.status !== "??ang thu??"){
                res.status(200).json({
                    success: false,
                    message: "Ph??ng ch??a ???????c thu??!"
                });
                return;
            }
            
            //check d??? li???u r???ng cho guests
            for(let i=0; i<guests.length; i++){
                let g = guests[i];
                if(!g || !g.fullname || !g.fullname.length || 
                    !g.typeId || 
                    !g.identityNumber || !g.identityNumber.length || 
                    !g.address || !g.address.length){
                        res.status(200).json({
                            success: false,
                            message: "?????u v??o kh??ng h???p l???!"
                        });
                    return;
                }
            }

            // check guest r???ng
            if(guests.length === 0){
                res.status(200).json({
                    success: false,
                    message: "Danh s??ch kh??ch r???ng!"
                });
                return;
            }
            // check guests qu?? quy ?????nh
            if(guests.length > maximumGuest){
                res.status(200).json({
                    success: false,
                    message: "Danh s??ch kh??ch v?????t qu?? s??? kh??ch t???i ??a!"
                });
                return;
            }

            //L???y ds guest c??
            let guestsOld = await RoomRentService.getGuetsByRoomRentId(parseInt(roomrentId));
            
            for(let i=0; i<guestsOld.length; i++){
                await RoomRentService.deleteGuestByIdentityNumber(guestsOld[i].identityNumber);
            }
            for(let j=0; j<guests.length; j++){
                guests[j].roomRentId = roomrentId;
                await RoomRentService.createGuestAPI(guests[j]);
            }
            res.status(200).json({
                success: true,
                message: "C???p nh???t phi???u thu?? th??nh c??ng!"
                });

        }catch(error){
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
                    message: "?????u v??o kh??ng h???p l???!"
                });
                return;
            }
            const resData = await RoomRentService.findRoomRentById(id);
            console.log(resData)
            if(!resData){
                res.status(200).json({
                    success: false,
                    message: "Phi???u thu?? kh??ng t???n t???i!"
                });
                return;
            }
            if(!resData.billId){
                res.status(200).json({
                    success: false,
                    message: "Kh??ng th??? x??a: Phi???u thu?? n??y ch??a ???????c thanh to??n!"
                });
                return;
            }
            const resData2 = await RoomRentService.deleteRoomRentById(id);
            res.status(200).json({
                success: true,
                roomRent: resData2,
                message: 'X??a th??nh c??ng!'
            })
            return;

        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    }
}

module.exports = new RoomRentController();