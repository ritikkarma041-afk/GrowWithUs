const { DataTypes } = require('sequelize');

const RoleModel = {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true, allowNull: false },
  name: { type: DataTypes.STRING, unique: true},
  descrption: {type: DataTypes.TEXT},
  IsActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  createdDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  createdBy: {type: DateTypes.STRING}
};

module.exports = (sequelize) => sequelize.define('roles', RoleModel);