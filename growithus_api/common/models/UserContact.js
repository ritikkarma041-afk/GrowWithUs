const { DataTypes } = require('sequelize');

const UserContactModel = {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true, allowNull: false },
  userId: { type: DataTypes.UUID, allowNull: false },
  type: { type: DataTypes.ENUM('EMAIL', 'PHONE', 'ADDRESS'), allowNull: false },
  valueEncrypted: { type: DataTypes.TEXT, allowNull: false },
  isVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
  isPrimary: { type: DataTypes.BOOLEAN, defaultValue: false },
  Isdeleted: { type: DataTypes.BOOLEAN, defaultValue: false },
  createdDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
};

module.exports = (sequelize) => sequelize.define('user_contact', UserContactModel, {
  timestamps: false
});