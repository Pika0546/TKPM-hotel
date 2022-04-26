var DataTypes = require("sequelize").DataTypes;
var _admin = require("./admin");
var _bill = require("./bill");
var _guest = require("./guest");
var _guesttype = require("./guesttype");
var _room = require("./room");
var _roomrent = require("./roomrent");
var _roomrentdetail = require("./roomrentdetail");
var _roomtype = require("./roomtype");
var _rule = require("./rule");

function initModels(sequelize) {
  var admin = _admin(sequelize, DataTypes);
  var bill = _bill(sequelize, DataTypes);
  var guest = _guest(sequelize, DataTypes);
  var guesttype = _guesttype(sequelize, DataTypes);
  var room = _room(sequelize, DataTypes);
  var roomrent = _roomrent(sequelize, DataTypes);
  var roomrentdetail = _roomrentdetail(sequelize, DataTypes);
  var roomtype = _roomtype(sequelize, DataTypes);
  var rule = _rule(sequelize, DataTypes);

  guest.belongsToMany(roomrent, { as: 'roomRentId_roomrents', through: roomrentdetail, foreignKey: "guestId", otherKey: "roomRentId" });
  roomrent.belongsToMany(guest, { as: 'guestId_guests', through: roomrentdetail, foreignKey: "roomRentId", otherKey: "guestId" });
  roomrent.belongsTo(bill, { foreignKey: "billId"});
  bill.hasMany(roomrent, { foreignKey: "billId"});
  bill.belongsTo(guest, { foreignKey: "guestId"});
  guest.hasMany(bill, { foreignKey: "guestId"});
  roomrentdetail.belongsTo(guest, { foreignKey: "guestId"});
  guest.hasMany(roomrentdetail, { foreignKey: "guestId"});
  guest.belongsTo(guesttype, { foreignKey: "typeId"});
  guesttype.hasMany(guest, { foreignKey: "typeId"});
  roomrent.belongsTo(room, { foreignKey: "roomId"});
  room.hasMany(roomrent, { foreignKey: "roomId"});
  roomrentdetail.belongsTo(roomrent, { foreignKey: "roomRentId"});
  roomrent.hasMany(roomrentdetail, { foreignKey: "roomRentId"});
  room.belongsTo(roomtype, { foreignKey: "typeId"});
  roomtype.hasMany(room, { foreignKey: "typeId"});

  return {
    admin,
    bill,
    guest,
    guesttype,
    room,
    roomrent,
    roomrentdetail,
    roomtype,
    rule,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
