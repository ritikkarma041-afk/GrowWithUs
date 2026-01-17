const { DataTypes } = require('sequelize');

const UserKycDocumentModel = {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true, allowNull: false },
  userId: { type: DataTypes.UUID, allowNull: false },
  doucumentType: { type: DataTypes.STRING, allowNull: false },
  documentNumberEncrypted: { type: DataTypes.TEXT, allowNull: false },
  documentUrl: { type: DataTypes.TEXT , allowNull: false },
  issuedDate: { type: DataTypes.DATE, allowNull: true },
  expiryDate: { type: DataTypes.DATE, allowNull: true },
  issuingCountry: { type: DataTypes.STRING, allowNull: false },
  verifiedAt: { type: DataTypes.DATE, allowNull: true },
  verifiedBy: { type: DataTypes.UUID, allowNull: true },
  status: { type: DataTypes.ENUM('PENDING', 'VERIFIED', 'REJECTED'), defaultValue: 'PENDING' },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
};

module.exports = (sequelize) => sequelize.define('user_kyc_document', UserKycDocumentModel);