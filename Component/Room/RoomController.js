class RoomController{
    getRoomList = async (req, res, next) => {
        res.render('room/list');
    }

    getAddRoom = async (req, res, next) => {
        res.render('room/add');
    }

    getEditRoom = async (req, res, next) => {
        res.render('room/edit');
    }
}

module.exports = new RoomController();