// server.js
import Fastify from 'fastify';
import dotenv from 'dotenv';
import jwt from '@fastify/jwt';
import dbConnector from './plugins/db-plugin.js';
import indexRoute from './routes/indexRoute.js';
import  authPlugins  from './plugins/auth-plugin.js';
import fastifyCors from '@fastify/cors';
import fastifyHelmet from '@fastify/helmet';
import fastifyRateLimit from '@fastify/rate-limit';

dotenv.config();
const app = Fastify({ logger: true });

// Register plugins IN ORDER:
// 1. JWT first
 await app.register(jwt, { secret: process.env.JWT_SECRET });

// 2. Auth plugin that depends on JWT
await app.register(authPlugins);



// security plugins
app.register(fastifyCors, {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
});

app.register(fastifyHelmet);
app.register(fastifyRateLimit, {
  max: 100,
  timeWindow: '1 minute'
});

// 3. DB connector
app.register(dbConnector);

// 4. Routes (which depend on the above)
app.register(indexRoute, { prefix: '/api/v1' });

const start = async () => {
  try {
    await app.listen({ port: process.env.PORT || 3000 });
    console.log(`Server running on http://localhost:${process.env.PORT || 3000}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();