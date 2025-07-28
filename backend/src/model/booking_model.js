 import sequelize from '../confiq/db.js';
 import { DataTypes } from 'sequelize';


export const Booking = sequelize.define('Booking', {
  customerName: DataTypes.STRING,
  checkIn: DataTypes.DATEONLY,
  checkOut: DataTypes.DATEONLY,
    userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'cancelled', ),

    defaultValue: 'pending',
  },
  visitStatus: {
    type: DataTypes.ENUM('checked-in', 'complete', 'no-show'),
    defaultValue: 'no-show',
  },
});

