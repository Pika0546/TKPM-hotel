const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('guest', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    fullname: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    identityNumber: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    typeId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'guesttype',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'guest',
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
        name: "typeId",
        using: "BTREE",
        fields: [
          { name: "typeId" },
        ]
      },
    ]
  });
};
