import UserService from "../services/user-service.js";

async function userRoutes(fastify) {

    fastify.post('/login', UserService.login);
    fastify.post('/registration', UserService.createUser);
    fastify.put('/update-User-Info/:id', UserService.updateUser);
    fastify.delete('/logout/:id', UserService.deleteUser);
}

export default userRoutes;












