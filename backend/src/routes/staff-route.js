import StaffService from "../services/staff-service.js";
import UserService from "../services/user-service.js";

async function visitRoutes(fastify) {

    fastify.addHook('onRequest', fastify.isStaff);
    fastify.post('/checkIn', StaffService.visitCheckIn);
    fastify.post('/complete', StaffService.visitComplete);
    fastify.get('/getUserById/:id', UserService.getUserById);
    
}
export default visitRoutes;