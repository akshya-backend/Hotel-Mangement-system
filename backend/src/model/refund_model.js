// models/refund_model.js
import { DataTypes } from 'sequelize';
import sequelize from '../confiq/db.js';

export const Refund = sequelize.define('Refund', {
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  reason: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('pending', 'processed', 'rejected'),
    defaultValue: 'pending',
  },
  issuedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  bookingId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});
