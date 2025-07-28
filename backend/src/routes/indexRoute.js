
import adminRoutes from './admin-route.js';
import bookingRoutes from './booking-route.js';
import generalRoutes from './genral-route.js';
import visitRoutes from './staff-route.js';
import userRoutes from './user-route.js';





async function indexRoute(fastify, options) {

  fastify.register(generalRoutes, { prefix: `/general` });
  fastify.register(bookingRoutes, { prefix: `0/booking` });
  fastify.register(userRoutes, { prefix: `/user` });
  fastify.register(visitRoutes, { prefix: `/visit` });
  fastify.register(adminRoutes, { prefix: `/admin` });
}


export default indexRoute; 