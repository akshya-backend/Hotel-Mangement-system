import fp from 'fastify-plugin';
import sequelize  from '../confiq/db.js';
import { Room } from '../model/room_model.js';


async function dbConnector(fastify, options) {
  try {
    await sequelize.authenticate();

    fastify.decorate('sequelize', sequelize);

    await sequelize.sync();

    const count = await Room.count();
    if (count === 0) {
      await Room.bulkCreate([
        { number: '101', type: 'Single', price: 100, isAvailable: true },
        { number: '102', type: 'Double', price: 150, isAvailable: true },
        { number: '103', type: 'Suite', price: 200, isAvailable: true },
        { number: '104', type: 'Deluxe', price: 250, isAvailable: true },
        { number: '105', type: 'Family', price: 300, isAvailable: true },
        { number: '106', type: 'Single', price: 100, isAvailable: true },
        { number: '107', type: 'Double', price: 150, isAvailable: true },   
      ]);
      fastify.log.info('Initial room data created.');
    }
  } catch (err) {
    fastify.log.error('DB connection error:', err);
  }
}

export default fp(dbConnector);
