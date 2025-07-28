import sequelize from '../confiq/db.js';
import { DataTypes } from 'sequelize';

export const Room = sequelize.define('Room', {
  number: DataTypes.STRING,
  type: DataTypes.ENUM('single', 'double', 'suite'),
  price: DataTypes.FLOAT,
  isAvailable: DataTypes.BOOLEAN,
})