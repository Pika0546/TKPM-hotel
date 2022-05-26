const RoomRentService = require('./RoomRentService')

class RoomRentController{
    getRoomRentList = async (req, res, next) => {
        res.render('roomrent/list')
    }
    getAddRoomRent = async (req, res, next) => {
        res.render('roomrent/add');
    }
    getDetailRoomRent = async (req, res, next) => {
        res.render('roomrent/edit');
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