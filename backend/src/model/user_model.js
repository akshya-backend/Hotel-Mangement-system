import { DataTypes } from 'sequelize';
import sequelize from '../confiq/db.js';

export const User = sequelize.define('User', {
  name: DataTypes.STRING,
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [4, 255],
    },
  },
  role: {
    type: DataTypes.ENUM('user', 'admin', 'staff'),
    defaultValue: 'user',
  },
});