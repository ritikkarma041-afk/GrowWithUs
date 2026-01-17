const { DataTypes } = require('sequelize');

const UserProfileModel = {
  userId: { type: DataTypes.UUID, primaryKey: true, allowNull: false },
  firstName: { type: DataTypes.STRING },
  lastName: { type: DataTypes.STRING },
  dateOfBirth: { type: DataTypes.DATE, allowNull: true },
  gender: { type: DataTypes.ENUM('MALE', 'FEMALE', 'OTHER'), allowNull: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
};

module.exports = (sequelize) => sequelize.define('user_profile', UserProfileModel);