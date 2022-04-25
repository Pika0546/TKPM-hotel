const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('roomrentdetail', {
    roomRent: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'roomrent',
        key: 'id'
      }
    },
    guest: {
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
          { name: "roomRent" },
          { name: "guest" },
        ]
      },
      {
        name: "guest",
        using: "BTREE",
        fields: [
          { name: "guest" },
        ]
      },
    ]
  });
};
