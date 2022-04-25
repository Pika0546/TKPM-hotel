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

  guest.belongsToMany(roomrent, { as: 'roomRent_roomrents', through: roomrentdetail, foreignKey: "guest", otherKey: "roomRent" });
  roomrent.belongsToMany(guest, { as: 'guest_guests', through: roomrentdetail, foreignKey: "roomRent", otherKey: "guest" });
  roomrent.belongsTo(bill, { as: "bill_bill", foreignKey: "bill"});
  bill.hasMany(roomrent, { as: "roomrents", foreignKey: "bill"});
  bill.belongsTo(guest, { as: "guest_guest", foreignKey: "guest"});
  guest.hasMany(bill, { as: "bills", foreignKey: "guest"});
  roomrentdetail.belongsTo(guest, { as: "guest_guest", foreignKey: "guest"});
  guest.hasMany(roomrentdetail, { as: "roomrentdetails", foreignKey: "guest"});
  guest.belongsTo(guesttype, { as: "type_guesttype", foreignKey: "type"});
  guesttype.hasMany(guest, { as: "guests", foreignKey: "type"});
  roomrent.belongsTo(room, { as: "room_room", foreignKey: "room"});
  room.hasMany(roomrent, { as: "roomrents", foreignKey: "room"});
  roomrentdetail.belongsTo(roomrent, { as: "roomRent_roomrent", foreignKey: "roomRent"});
  roomrent.hasMany(roomrentdetail, { as: "roomrentdetails", foreignKey: "roomRent"});
  room.belongsTo(roomtype, { as: "type_roomtype", foreignKey: "type"});
  roomtype.hasMany(room, { as: "rooms", foreignKey: "type"});

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
