import sequelize from '../confiq/db.js';
import { Room } from '../model/room_model.js';
import logger from '../utils/logger.js';

async function dbConnector() {
  const retries = 5;
  const delay = 5000; // 5 seconds
  try {
    const isConnected = await sequelize.authenticate();
    if (isConnected) {
      logger.info('Database connection established successfully.');
    } else {
      logger.error('Database connection failed.');
    }

    await sequelize.sync();

    const count = await Room.count();
    console.log(`Current room count: ${count}`);
    
    if (count === 0) {
      await Room.bulkCreate([
        { number: '101', type: 'Single', price: 100, isAvailable: true },
        { number: '102', type: 'Double', price: 150, isAvailable: true },
        { number: '103', type: 'Suite', price: 200, isAvailable: true },
        { number: '104', type: 'double', price: 250, isAvailable: true },
        { number: '105', type: 'single', price: 300, isAvailable: true },
        { number: '106', type: 'single', price: 100, isAvailable: true },
        { number: '107', type: 'suite', price: 150, isAvailable: true },
      ]);
          const count2 = await Room.count();
      console.log(`Initial room count: ${count2}`);
      logger.info('Initial room data created.');
    }
  } catch (err) {
     if (retries > 1) {
      await new Promise(res => setTimeout(res, delay));
      return dbConnector(retries - 1, delay);
    } else {
      throw err;
    }
    logger.error(err, 'DB connection error');
  }
}

export default dbConnector;
