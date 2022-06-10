const ObjectUtil = require("./object");
const DateUtil = require('./date');
class BillUtil{
    calculateRoomCost = (roomRent, rule) => {
        const rentDate = roomRent.createdAt;
        const returnDate = roomRent.bill.createdAt;
        const totalDate = Math.ceil(DateUtil.convertMilisecondtoDay(returnDate - rentDate));
        
        let result = roomRent.room.roomtype.price * totalDate;
        const guestNumber = roomRent.guests.length;
        let surcharge = 0;
        if(guestNumber >= rule.surchargeFrom){
            surcharge =  result * rule.surcharge;
        }
        roomRent.guests.forEach(guest => {
            if(guest){
                surcharge += (guest.guesttype.coefficient - 1) * result;
            }
        });
        result += surcharge;
        return result;
    }

    calculateRoomTotalCostInBill = (roomBill, rule) => {
        let result = roomBill.room.roomtype.price * roomBill.numRentDays;
        const guestNumber = roomBill.guests.length;
        let surcharge = 0;
        if(guestNumber >= rule.surchargeFrom){
            surcharge =  result * rule.surcharge;
        }

        let guestTypeInRoom = [...new Map(roomBill.guests.map(item =>[item.guesttype.typeName, item])).values()];;
        guestTypeInRoom.forEach(type => {
            if(type){
                surcharge += (type.guesttype.coefficient - 1) * result;
            }
        });

        result += surcharge;
        return result;
    }
}

module.exports = new BillUtil();