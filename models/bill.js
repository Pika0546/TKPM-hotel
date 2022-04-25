const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('bill', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    guest: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'guest',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'bill',
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
        name: "guest",
        using: "BTREE",
        fields: [
          { name: "guest" },
        ]
      },
    ]
  });
};
