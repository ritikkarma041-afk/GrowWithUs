const { DataTypes } = require('sequelize');

const RolePermissionModel = {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true, allowNull: false },
    roleId: { type: DataTypes.UUID, allowNull: false },
    permissionId: { type: DataTypes.UUID, allowNull: false },
    createdDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    createBy: { type: DataTypes.STRING }
  };

module.exports = (sequelize) => sequelize.define('role_permission', RolePermissionModel);