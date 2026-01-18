const { DataTypes } = require('sequelize');

const RolePermissionModel = {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true, allowNull: false },
  roleId: { type: DataTypes.UUID, allowNull: false },
  permissionId: { type: DataTypes.UUID, allowNull: false },
  createdDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  createdBy: { type: DataTypes.STRING }
};

module.exports = (sequelize) => {
  const RolePermission = sequelize.define('role_permission', RolePermissionModel, {
    timestamps: false
  });

  // Define the association here
  const Permission = require('./Permission')(sequelize); // Import Permission model
  RolePermission.belongsTo(Permission, { foreignKey: 'permissionId', as: 'Permission' });

  return RolePermission;
};