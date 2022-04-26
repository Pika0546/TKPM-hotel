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
    getRoomList = async (req, res, next) => {
        try {
            const pageNumber = req.query.page;
            currentPage = PageUtil.getCurrentPage(pageNumber, totalPage);
            const room = await RoomService.getRoomList(limit, currentPage);
            totalRoom = await RoomService.countAllRoom();
            totalPage = Math.ceil(totalRoom/limit);
            const paginationArray = PageUtil.getPaginationArray(currentPage, totalPage, maximumPagination);
            res.render('room/list', {
                room: room.map((item) => ObjectUtil.getObject(item)),
                page: currentPage,
                totalPage,
                totalRoom,
                paginationArray
            });
        } catch (error) {
            console.log(error);
            next(createError(500));
        }
    }

    getRoomListApi = async (req, res, next) => {
        try {
            const pageNumber = req.query.page;
            currentPage = PageUtil.getCurrentPage(pageNumber, totalPage);
            const room = await RoomService.getRoomList(limit, currentPage);
            totalRoom = await RoomService.countAllRoom();
            totalPage = Math.ceil(totalRoom/limit);
            const paginationArray = PageUtil.getPaginationArray(currentPage, totalPage, maximumPagination);
            res.status(200).json({
                room: room.map((item) => ObjectUtil.getObject(item)),
                page: currentPage,
                totalPage,
                totalRoom,
                paginationArray
            });
        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    }

    getAddRoom = async (req, res, next) => {
        res.render('room/add');
    }

    getEditRoom = async (req, res, next) => {
        res.render('room/edit');
    }
}

module.exports = new RoomController();