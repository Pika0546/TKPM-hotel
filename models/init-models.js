var DataTypes = require("sequelize").DataTypes;
var _admin = require("./admin");
var _bill = require("./bill");
var _guest = require("./guest");
var _guesttype = require("./guesttype");
var _room = require("./room");
var _roomrent = require("./roomrent");
var _roomtype = require("./roomtype");
var _rule = require("./rule");

function initModels(sequelize) {
  var admin = _admin(sequelize, DataTypes);
  var bill = _bill(sequelize, DataTypes);
  var guest = _guest(sequelize, DataTypes);
  var guesttype = _guesttype(sequelize, DataTypes);
  var room = _room(sequelize, DataTypes);
  var roomrent = _roomrent(sequelize, DataTypes);
  var roomtype = _roomtype(sequelize, DataTypes);
  var rule = _rule(sequelize, DataTypes);

  roomrent.belongsTo(bill, { as: "bill", foreignKey: "billId"});
  bill.hasMany(roomrent, { as: "roomrents", foreignKey: "billId"});
  bill.belongsTo(guest, { as: "guest", foreignKey: "guestId"});
  guest.hasMany(bill, { as: "bills", foreignKey: "guestId"});
  guest.belongsTo(guesttype, { as: "type", foreignKey: "typeId"});
  guesttype.hasMany(guest, { as: "guests", foreignKey: "typeId"});
  roomrent.belongsTo(room, { as: "room", foreignKey: "roomId"});
  room.hasMany(roomrent, { as: "roomrents", foreignKey: "roomId"});
  guest.belongsTo(roomrent, { as: "roomRent", foreignKey: "roomRentId"});
  roomrent.hasMany(guest, { as: "guests", foreignKey: "roomRentId"});
  room.belongsTo(roomtype, { as: "type", foreignKey: "typeId"});
  roomtype.hasMany(room, { as: "rooms", foreignKey: "typeId"});

  return {
    admin,
    bill,
    guest,
    guesttype,
    room,
    roomrent,
    roomtype,
    rule,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
