const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('roomrentdetail', {
    roomRentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'roomrent',
        key: 'id'
      }
    },
    guestId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'guest',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'roomrentdetail',
    timestamps: true,
    paranoid: true,
    timestamp: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "roomRentId" },
          { name: "guestId" },
        ]
      },
      {
        name: "guestId",
        using: "BTREE",
        fields: [
          { name: "guestId" },
        ]
      },
    ]
  });
};
