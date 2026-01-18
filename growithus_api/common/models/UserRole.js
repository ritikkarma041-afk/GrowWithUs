const { DataTypes } = require('sequelize');

const UserRoleModel = {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true, allowNull: false },
    userId: { type: DataTypes.UUID, allowNull: false },
    roleId: { type: DataTypes.UUID, allowNull: false },
    isdeleted: { type: DataTypes.BOOLEAN, defaultValue: false },
    createdDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    createdBy: { type: DataTypes.STRING }
  };

module.exports = (sequelize) => sequelize.define('user_roles', UserRoleModel, {
  timestamps: false
});