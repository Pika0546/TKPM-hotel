const ObjectUtil = require("./object");
const DateUtil = require('./date');
class BillUtil{
    calculateRoomCost = (roomRent, rule) => {
        const rentDate = roomRent.createdAt;
        const returnDate = roomRent.bill.createdAt;
        const totalDate = Math.round(DateUtil.convertMilisecondtoDay(returnDate - rentDate));

        let result = 0;
        const guestNumber = roomRent.guests.length;
        let surcharge = 0;
        if(guestNumber >= rule.surchargeFrom){
            surcharge =  roomRent.room.roomtype.price * rule.surcharge;
        }

        roomRent.guests.forEach(guest => {
            if(guest){

            }
        });

        return roomRent.room.roomtype.price ;
    }
}

module.exports = new BillUtil();