const { DataTypes } = require('sequelize');

const UserProfileModel = {
  userId: { type: DataTypes.UUID, primaryKey: true, allowNull: false },
  firstName: { type: DataTypes.STRING },
  lastName: { type: DataTypes.STRING },
  dateOfBirth: { type: DataTypes.DATE, allowNull: true },
  gender: { type: DataTypes.ENUM('MALE', 'FEMALE', 'OTHER'), allowNull: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  createdDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updatedDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
};

module.exports = (sequelize) => {
  const UserProfile = sequelize.define('user_profile', UserProfileModel, {
    timestamps: false
  });

  // Define the association here
  const userAddress = require('./UserAddress')(sequelize); // Import Address model
  const userContact = require('./UserContact')(sequelize); // Import Contact model

  UserProfile.hasMany(userAddress, { foreignKey: 'userId', as: 'Address' });

  UserProfile.hasMany(userContact, { foreignKey: 'userId', as: 'Contact' });

  return UserProfile;
}