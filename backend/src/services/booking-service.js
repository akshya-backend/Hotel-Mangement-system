import { Refund, sequelize } from '../model/index_model.js';
import crypto from 'crypto';
import { Room } from '../model/room_model.js';
import { Booking } from '../model/booking_model.js';
import { Payment } from '../model/payment_model.js';
import { successResponse, errorResponse, notFoundResponse, serverErrorResponse } from '../utils/responseHelper.js';

export default class BookingService {
  static async initiateOrder(req, res) {
    try {
      const { roomId, amount } = req.body;
      const fakeOrderId = 'order_' + Math.random().toString(36).substr(2, 10);
      
      const data = { orderId: fakeOrderId, amount, currency: 'INR' };
      return res.status(200).json(successResponse(data, 'Order initiated successfully'));
    } catch (error) {
      return res.status(500).json(serverErrorResponse(error));
    }
  }

  static async verifyAndBook(req, res) {
    const t = await sequelize.transaction();
    try {
      const {
        orderId, paymentId, signature,
        customerName, roomId, checkIn, checkOut, amount, method
      } = req.body;

      // Verify signature
      const expected = crypto.createHmac('sha256', process.env.FAKE_SECRET)
        .update(orderId + "|" + paymentId).digest('hex');
      if (expected !== signature) {
        await t.rollback();
        return res.status(400).json(errorResponse('Invalid payment signature'));
      }

      // Check room availability
      const room = await Room.findOne({
        where: { id: roomId, isAvailable: true },
        lock: t.LOCK.UPDATE, 
        transaction: t
      });
      
      if (!room) {
        await t.rollback();
        return res.status(404).json(notFoundResponse('Available room'));
      }

      // Create booking
      const booking = await Booking.create({
        customerName, checkIn, checkOut, RoomId: roomId, status: 'confirmed'
      }, { transaction: t });

      // Create payment record
      await Payment.create({
        BookingId: booking.id, method, amount, status: 'paid', transactionId: paymentId
      }, { transaction: t });

      // Update room availability
      await room.update({ isAvailable: false }, { transaction: t });
      await t.commit();

      return res.status(201).json(successResponse(
        { booking }, 
        'Booking confirmed successfully', 
        201
      ));
    } catch (error) {
      await t.rollback();
      return res.status(500).json(serverErrorResponse(error));
    }
  }

  static async cashBooking(req, res) {
    const t = await sequelize.transaction();
    try {
      const { customerName, roomId, checkIn, checkOut, amount } = req.body;

      // Check room availability
      const room = await Room.findOne({
        where: { id: roomId, isAvailable: true },
        lock: t.LOCK.UPDATE, 
        transaction: t
      });
      
      if (!room) {
        await t.rollback();
        return res.status(404).json(notFoundResponse('Available room'));
      }

      // Create booking
      const booking = await Booking.create({
        customerName, checkIn, checkOut, RoomId: roomId, status: 'pending'
      }, { transaction: t });

      // Create payment record
      await Payment.create({
        BookingId: booking.id, method: 'cash', amount, status: 'confirmed'
      }, { transaction: t });

      // Update room availability
      await room.update({ isAvailable: false }, { transaction: t });
      await t.commit();

      return res.status(201).json(successResponse(
        { booking }, 
        'Cash booking created successfully - payment pending', 
        201
      ));
    } catch (error) {
      await t.rollback();
      return res.status(500).json(serverErrorResponse(error));
    }
  }

  static async cancelBooking(req, res) {
    const t = await sequelize.transaction();
    try {
      const booking = await Booking.findByPk(req.params.id, {
        include: [Payment, Room], 
        transaction: t
      });
      
      if (!booking) {
        await t.rollback();
        return res.status(404).json(notFoundResponse('Booking'));
      }
      
      if (booking.status === 'cancelled') {
        await t.rollback();
        return res.status(400).json(errorResponse('Booking is already cancelled'));
      }

      // Check if cancellation is allowed
      const now = new Date();
      if (new Date(booking.checkIn) <= now) {
        await t.rollback();
        return res.status(400).json(errorResponse('Refund not allowed after check-in time'));
      }

      // Cancel booking
      await booking.update({ status: 'cancelled' }, { transaction: t });
      await booking.Room.update({ isAvailable: true }, { transaction: t });

      // Process refund for non-cash payments
      if (booking.Payment.method !== 'cash' && booking.Payment.status === 'paid') {
        await Refund.create({
          BookingId: booking.id,
          amount: booking.Payment.amount,
          reason: req.body.reason || 'User cancelled before check-in'
        }, { transaction: t });

        await booking.Payment.update({ status: 'refunded' }, { transaction: t });
        // Here you'd call real refund API in production
      }

      await t.commit();
      
      return res.status(200).json(successResponse(
        { bookingId: booking.id }, 
        'Booking cancelled successfully'
      ));
    } catch (error) {
      await t.rollback();
      return res.status(500).json(serverErrorResponse(error));
    }
  }
}
