import RoomService from "../services/room-service.js";

async function generalRoutes(fastify) {
    fastify.get('/getAllRooms', RoomService.getAllRooms);
    fastify.get('/getRoomById/:id', RoomService.getRoomById);
    fastify.get('/getAvailableRooms', RoomService.getAvailableRooms);
    fastify.get('/getBookedRooms', RoomService.bookedRooms);
    fastify.get('/getRoomByType/:type', RoomService.getRoomByType);
    fastify.get('/getRoomByPriceRange', RoomService.getRoomByPriceRange);
    fastify.get('/getRoomByAvailability/:date', RoomService.getRoomAvailabilityByDate);


}
export default generalRoutes;