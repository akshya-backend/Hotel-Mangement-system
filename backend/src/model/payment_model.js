import sequelize from '../confiq/db.js';
import { DataTypes } from 'sequelize';

export const Payment = sequelize.define('Payment', {
  method: {
    type: DataTypes.ENUM('cash', 'card', 'upi'),
    defaultValue: 'cash',
  },
  amount: DataTypes.FLOAT,
  status: {
    type: DataTypes.ENUM('paid', 'refunded', 'confirmed'),
    defaultValue: 'confirmed',
  },
});
