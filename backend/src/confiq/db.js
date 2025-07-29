import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
 import mysql2 from 'mysql2';
import { Room } from '../model/room_model.js';
import logger from '../utils/logger.js';

dotenv.config();

let retries = 5;
const MAX_RETRIES = retries;
const delay = 3000; // 3 seconds

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    dialectModule: mysql2,
    logging: false,
  }
);

 export async function dbConnector() {
  try {
    const isConnected = await sequelize.authenticate();
    if (isConnected) {
      logger.info('Database connection established successfully.');
    } else {
      logger.error('Database connection failed.');
    }

    await sequelize.sync();

    const count = await Room.count();
    if (count === 0) {
      await Room.bulkCreate([
        { number: '101', type: 'single', price: 100, isAvailable: true },
        { number: '102', type: 'double', price: 150, isAvailable: true },
        { number: '103', type: 'suite', price: 200, isAvailable: true },
        { number: '104', type: 'double', price: 250, isAvailable: true },
        { number: '105', type: 'suite', price: 300, isAvailable: true },
        { number: '106', type: 'single', price: 100, isAvailable: true },
        { number: '107', type: 'double', price: 150, isAvailable: true },
      ]);
       const totalrooms = await Room.count();
       console.log(`Total rooms created: ${totalrooms}`);
      logger.info('Initial room data created.');
    }
  } catch (err) {
      if (retries > 0) {
      console.log(`🔁 Retry DB connection... (${MAX_RETRIES - retries + 1})`);
      await new Promise(res => setTimeout(res, 3000));
      return dbConnector(retries - 1);
    } else {
      throw err;
    }
  }
}
export default sequelize;
