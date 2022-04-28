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
            queryStatus: status
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
        res.render('room/add', {roomTypes});
    }

    getEditRoom = async (req, res, next) => {
        res.render('room/edit');
    }

    validateRoomIdAPI = async (req, res, next) => {
        try {
            const roomId = req.body.roomId || null;
            const room = await RoomService.getRoomByRoomId(roomId);
            console.log(room, roomId);
            if(room){
                res.status(200).json({found: true});
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
        console.log(req.body);
        try {
            const room = await RoomService.createRoom(roomId, typeId, note);
            res.redirect(`/room/edit/${room.id}`);
        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    }
}

module.exports = new RoomController();