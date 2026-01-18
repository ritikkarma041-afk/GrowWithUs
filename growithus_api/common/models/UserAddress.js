const { DataTypes } = require('sequelize');

const UserAddressModel = {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true, allowNull: false },
  userId: { type: DataTypes.UUID, allowNull: false },
  AddressType: { type: DataTypes.ENUM('CURRENT', 'PERMANENT'), allowNull: false },
  AddressLine1: { type: DataTypes.STRING, allowNull: false },
  AddressLine2: { type: DataTypes.STRING, allowNull: true },
  City: { type: DataTypes.STRING, allowNull: false },
  State: { type: DataTypes.STRING, allowNull: false },
  ZipCode: { type: DataTypes.STRING, allowNull: false },
  Country: { type: DataTypes.STRING, allowNull: false },
  Isdeleted: { type: DataTypes.BOOLEAN, defaultValue: false },
  createdDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updatedDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
};

module.exports = (sequelize) => sequelize.define('user_address', UserAddressModel, {
  timestamps: false
});