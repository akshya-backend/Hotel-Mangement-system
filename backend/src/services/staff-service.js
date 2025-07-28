import { Booking } from "../model/booking_model.js";
import {
  successResponse,
  errorResponse,
  notFoundResponse,
  serverErrorResponse
} from '../utils/responseHelper.js';

class StaffService {
  static async visitCheckIn(req, res) {
    const { bookingId } = req.body;

    if (!bookingId) {
      return errorResponse(res, 400, 'Booking ID is required');
    }

    try {
      const booking = await Booking.findByPk(bookingId);

      if (!booking) {
        return notFoundResponse(res, 'Booking not found');
      }

      if (booking.visitStatus && booking.visitStatus !== 'no-show') {
        return errorResponse(res, 400, 'Booking already checked-in or completed');
      }

      await booking.update({ visitStatus: 'checked-in' });

      return successResponse(res, {
        message: 'Check-in successful',
        bookingId: booking.id,
        visitStatus: booking.visitStatus
      });

    } catch (err) {
      console.error("Check-in error:", err);
      return serverErrorResponse(res);
    }
  }

  static async visitComplete(req, res) {
    const { bookingId } = req.body;

    if (!bookingId) {
      return errorResponse(res, 400, 'Booking ID is required');
    }

    try {
      const booking = await Booking.findByPk(bookingId);

      if (!booking) {
        return notFoundResponse(res, 'Booking not found');
      }

      if (booking.visitStatus !== 'checked-in') {
        return errorResponse(res, 400, 'Booking must be checked-in first');
      }

      await booking.update({ visitStatus: 'complete' });

      return successResponse(res, {
        message: 'Visit marked as completed',
        bookingId: booking.id,
        visitStatus: booking.visitStatus
      });

    } catch (err) {
      console.error("Visit complete error:", err);
      return serverErrorResponse(res);
    }
  }
}

export default StaffService;
