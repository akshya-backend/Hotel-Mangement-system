import fastifyPlugin from "fastify-plugin";

// auth-plugin.js
async function authPlugins(fastify) {
  // Verify JWT is configured
  if (!fastify.jwt) {
    throw new Error('@fastify/jwt not registered!');
  }

  // Admin verification middleware
  fastify.decorate('isAdmin', async function(request, reply) {
    try {
      await request.jwtVerify();
      
      const isAdmin = request.user.role === 'admin';
      if (!isAdmin) {
        reply.code(403).send({ error: 'Admin access required' });
        return; 
      }
    } catch (err) {
      reply.code(401).send({ error: 'Invalid or expired token' });
      return;
    }
  });

  // isLoggedIn decorator
   fastify.decorate('isLoggedIn', async function(request, reply) {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.code(401).send({ error: 'Unauthorized' });
    }
  });

  fastify.log.info('Auth plugin registered: isAdmin decorator added');



//staff verification middleware
fastify.decorate('isStaff', async function(request, reply) {
  try {
    await request.jwtVerify();
    const isStaff = request.user.role === 'staff';
    if (!isStaff) {
      reply.code(403).send({ error: 'Staff access required' });
      return; 
    } 
  } catch (err) {
    reply.code(401).send({ error: 'Invalid or expired token' });
    return;
  } 

});
}
// Export the plugin wrapped in fastify-plugin
const authPlugin = fastifyPlugin(authPlugins,{
      dependencies: ['@fastify/jwt'] 

});
 export default authPlugin;