const { DataTypes } = require('sequelize');

const UserModel = {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true, allowNull: false },
  username: { type: DataTypes.STRING(150), allowNull: false, unique: true },
  passwordHash: { type: DataTypes.TEXT, allowNull: false },
  status: { type: DataTypes.ENUM('ACTIVE', 'INACTIVE', 'BANNED', 'SUSPENDED', 'CLOSED'), defaultValue: 'ACTIVE' },
  lastLogin: { type: DataTypes.DATE, allowNull: true },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
};

module.exports = (sequelize) => sequelize.define('users', UserModel);