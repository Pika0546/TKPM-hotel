const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('roomrent', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    roomId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'room',
        key: 'id'
      }
    },
    billId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'bill',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'roomrent',
    timestamps: true,
    paranoid: true,
    timestamp: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "roomId",
        using: "BTREE",
        fields: [
          { name: "roomId" },
        ]
      },
      {
        name: "billId",
        using: "BTREE",
        fields: [
          { name: "billId" },
        ]
      },
    ]
  });
};
