const { DataTypes } = require('sequelize');

const UserTransactionModel = {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true, allowNull: false },
  userId: { type: DataTypes.UUID, allowNull: false },
  amount: { type: DataTypes.DECIMAL(18, 2), allowNull: false },
  createdDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  transactionType: { type: DataTypes.ENUM('DEPOSIT', 'WITHDRAW'), allowNull: false },
  paymentMode: { type: DataTypes.ENUM('UPI', 'CARD', 'NET_BANKING', 'WALLET') },
  transactionReferenceId: { type: DataTypes.STRING, unique: true, allowNull: false },
  destinationAccount: { type: DataTypes.STRING, allowNull: false },
  status: { type: DataTypes.ENUM('PENDING', 'SUCCESS', 'FAILED'), defaultValue: 'PENDING' },
};

module.exports = (sequelize) => sequelize.define('user_transactions', UserTransactionModel, {
  timestamps: false
});