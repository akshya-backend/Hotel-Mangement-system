// models/index_model.js
import sequelize  from '../confiq/db.js';
import { User } from './user_model.js';
import { Room } from './room_model.js';
import { Booking } from './booking_model.js';
import { Payment } from './payment_model.js';
import { Refund } from './refund_model.js';
import logger from '../utils/logger.js';
const delay = 3000; // 3 seconds

// Associations
User.hasMany(Booking, { foreignKey: 'userId' });
Booking.belongsTo(User, { foreignKey: 'userId' });

Room.hasMany(Booking, { foreignKey: 'roomId' });
Booking.belongsTo(Room, { foreignKey: 'roomId' });

Booking.hasOne(Payment, { foreignKey: 'bookingId' });
Payment.belongsTo(Booking, { foreignKey: 'bookingId' });

Booking.hasOne(Refund, { foreignKey: 'bookingId' });
Refund.belongsTo(Booking, { foreignKey: 'bookingId' });

export async function dbConnector(retries = 5) {
  try {
    await sequelize.authenticate();
    logger.info('Database connection established successfully.');

    await sequelize.sync({ alter: true });

    const roomCount = await Room.count();
    if (roomCount === 0) {
      await Room.bulkCreate([
        { number: '101', type: 'single', price: 100, isAvailable: true },
        { number: '102', type: 'double', price: 150, isAvailable: true },
        { number: '103', type: 'suite', price: 200, isAvailable: true },
        { number: '104', type: 'double', price: 250, isAvailable: true },
        { number: '105', type: 'suite', price: 300, isAvailable: true },
        { number: '106', type: 'single', price: 100, isAvailable: true },
        { number: '107', type: 'double', price: 150, isAvailable: true },
      ]);
      logger.info('Initial room data created.');
    } else {
      console.log(`Total rooms already exist: ${roomCount}`);
    }

    // After rooms are checked/created, check/create users
    let userCount = await User.count();
    if (userCount === 0) {
      await User.bulkCreate([
        { name: 'Admin', email: 'admin@example.com', password: 'admin123', role: 'admin' },
        { name: 'Staff', email: 'staff@example.com', password: 'staff123', role: 'staff' },
        { name: 'User', email: 'user@example.com', password: 'user123', role: 'user' }
      ]);
      userCount = await User.count(); // Refresh count after create
      console.log('Default admin user created.');
    } else {
      console.log(`Total users already exist: ${userCount}`);
    }

    console.log(`Total users: ${userCount}`);
    console.log(`Total rooms: ${await Room.count()}`);

  } catch (err) {
    console.error('DB connection error:', err);
    if (retries > 0) {
      console.log(`🔁 Retry DB connection... (${5 - retries + 1})`);
      await new Promise(res => setTimeout(res, delay));
      return dbConnector(retries - 1);
    } else {
      throw err;
    }
  }
}

export {
  sequelize,
  User,
  Room,
  Booking,
  Payment,
  Refund,
};
