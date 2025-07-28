import BookingService from "../services/booking-service.js";

async function bookingRoutes(fastify) {

    fastify.addHook('onRequest', fastify.isLoggedIn);
    fastify.post('/initiateOrder', BookingService.initiateOrder);
    fastify.post('/verifyAndBook', BookingService.verifyAndBook);
    fastify.post('/cashBooking', BookingService.cashBooking);
    fastify.delete('/cancelBooking/:id', BookingService.cancelBooking);
}

export default bookingRoutes;