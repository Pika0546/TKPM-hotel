const createError = require('http-errors');
const PageUtil = require('../../utils/page');
const ObjectUtil = require('../../utils/object');

const RoomService = require("./RoomService");

const maximumPagination = 5;
let currentPage = 1;
let totalPage = 1;
let totalRoom = 0;
const limit = 5;
class RoomController{

    fetchRoomListFromDB = async (req, res, next) => {
        const pageNumber = req.query.page;
        const roomId = req.query.room || null;
        const typeId = req.query.typeId || null;
        const status = req.query.status || null;
        currentPage = PageUtil.getCurrentPage(pageNumber, totalPage);
        const room = await RoomService.getRoomList(limit, currentPage, roomId, typeId, status);
        const roomTypes = await RoomService.getRoomTypeList();
        totalRoom = await RoomService.countAllRoom(roomId, typeId, status);
        totalPage = Math.ceil(totalRoom/limit);
        const paginationArray = PageUtil.getPaginationArray(currentPage, totalPage, maximumPagination);
        return {
            room: room.map((item) => ObjectUtil.getObject(item)),
            page: currentPage,
            totalPage,
            totalRoom,
            paginationArray,
            roomTypes,
            queryRoom:roomId,
            queryType: typeId,
            queryStatus: status,
            prevPage: (currentPage > 1) ? currentPage - 1 : 1,
            nextPage: (currentPage < totalPage) ? currentPage + 1 : totalPage,
        }
    }

    getRoomList = async (req, res, next) => {
        try {
            const roomListData = await this.fetchRoomListFromDB(req, res, next);
            res.render('room/list', roomListData);
        } catch (error) {
            console.log(error);
            next(createError(500));
        }
    }

    getRoomListApi = async (req, res, next) => {
        try {
            const roomListData = await this.fetchRoomListFromDB(req, res, next);
            res.status(200).json(roomListData)
        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    }

    getAddRoom = async (req, res, next) => {
        const roomTypes = await RoomService.getRoomTypeList();
        res.render('room/add', {roomTypes, message: req.flash('create-room-message')});
    }

    getEditRoom = async (req, res, next) => {
        const {id: roomId} = req.params;
        try {
            const room = await RoomService.getRoomByRoomId(roomId);
            const roomTypes = await RoomService.getRoomTypeList();
            if(room){
                res.render('room/edit', {
                    room: ObjectUtil.getObject(room),
                    roomTypes,
                    message: req.flash('edit-room-message'),
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

    validateRoomIdAPI = async (req, res, next) => {
        try {
            const roomId = req.body.roomId || null;
            const room = await RoomService.getRoomByRoomId(roomId);
            if(room){
                res.status(200).json({found: true, room});
            }
            else{
                res.status(200).json({found: false});
            }
        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    }

    createRoom = async (req, res, next) => {
        const {roomId, typeId, note} = req.body;
        try {
            const otherRoom = await RoomService.getRoomByRoomId(roomId);
            const type = await RoomService.getRoomTypeById(typeId);
            if(otherRoom){
                console.log("Phòng đã tồn tại!");
                req.flash("create-room-message", {success: false, message: "Phòng đã tồn tại!"})
                res.redirect("/room/add")
            }
            else if(!type || !note || !roomId){
                console.log("Đầu vào không hợp lệ!");
                req.flash("create-room-message",  {success: false, message:"Đầu vào không hợp lệ!"})
                res.redirect("/room/add")
            }
            else{
                const room = await RoomService.createRoom(roomId, typeId, note);
                req.flash("edit-room-message", {success: true, message: "Thêm phòng thành công!"})
                res.redirect(`/room/edit/${room.roomId}`);
            }
        } catch (error) {
            console.log(error);
            next(createError(500));
        }
    }

    updateRoom = async (req, res ,next) => {
        try {
            const roomId = req.params.id;
            const {roomId: newRoomId, typeId, note} = req.body; 
            const room = await RoomService.getRoomByRoomId(roomId);
            const type = await RoomService.getRoomTypeById(typeId);
            if(room && type && note){
                const newRoom = await RoomService.updateRoom(room.id, newRoomId, typeId, note);
                res.redirect(`/room/edit/${newRoomId}`);
            }
            else{
                console.log("Đầu vào không hợp lệ!");
                req.flash("edit-room-message", "Đầu vào không hợp lệ!")
                res.redirect("/room/edit/" + roomId);
            }
        } catch (error) {
            console.log(error);
            next(createError(500));
        }
        
    }

    deleteRoomAPI = async (req, res, next) => {
        try {
            const roomId = req.params.id;
            const room = await RoomService.getRoomByRoomId(roomId);
            if(room){
                if(room.status === "Trống"){
                    const deletedRoom = await RoomService.deleteRoomByRoomId(roomId);
                    res.status(200).json({
                        success: true,
                        room: deletedRoom
                    })
                }
                else{
                    res.status(200).json({
                        success: false,
                        message: "Xóa thất bại, phòng đang được thuê."
                    })
                }
            }
            else{
                console.log("Room not found");
                res.status(200).json({
                    success: false,
                    message: "Không tìm thấy phòng!"
                })
            }
        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    }
}

module.exports = new RoomController();