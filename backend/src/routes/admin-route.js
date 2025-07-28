import RoomService from "../services/room-service.js";

async function adminRoutes(fastify) {

    fastify.addHook('onRequest', fastify.isAdmin);
    fastify.post('/createRoom', RoomService.createRoom);
    fastify.put('/updateRoom/:id', RoomService.updateRoom);
    fastify.delete('/deleteRoom/:id', RoomService.deleteRoom);
}

export default adminRoutes;