// models/index_model.js
import sequelize  from '../confiq/db.js';
import { User } from './user_model.js';
import { Room } from './room_model.js';
import { Booking } from './booking_model.js';
import { Payment } from './payment_model.js';
import { Refund } from './refund_model.js';

// Associations
User.hasMany(Booking, { foreignKey: 'userId' });
Booking.belongsTo(User, { foreignKey: 'userId' });

Room.hasMany(Booking, { foreignKey: 'roomId' });
Booking.belongsTo(Room, { foreignKey: 'roomId' });

Booking.hasOne(Payment, { foreignKey: 'bookingId' });
Payment.belongsTo(Booking, { foreignKey: 'bookingId' });

Booking.hasOne(Refund, { foreignKey: 'bookingId' });
Refund.belongsTo(Booking, { foreignKey: 'bookingId' });

export {
  sequelize,
  User,
  Room,
  Booking,
  Payment,
  Refund,
};
