import { Room } from "../model/room_model.js";
import { successResponse,errorResponse, notFoundResponse,serverErrorResponse} from "../utils/responseHelper.js";
import { Op, literal } from 'sequelize';
import logger from "../utils/logger.js";

class RoomService {
    static async getAllRooms() {
        try {
            const findRooms = await Room.findAll();
            return successResponse(findRooms, 'Rooms retrieved successfully');
        } catch (error) {
            return serverErrorResponse(error);
        }
    }

    static async getRoomById(id) {
        try {
            const findRoom = await Room.findByPk(id);
            if (!findRoom) {
                return notFoundResponse('Room');
            }
            return successResponse(findRoom, 'Room retrieved successfully');
        } catch (error) {
            return serverErrorResponse(error);
        }
    }

    static async createRoom(roomData) {
        try {
            const newRoom = await Room.create({
                number: roomData.number,
                type: roomData.type,
                price: roomData.price,
                isAvailable: roomData.isAvailable
            });
            return successResponse(newRoom, 'Room created successfully', 201);
        } catch (error) {
            return errorResponse('Error creating room', 400, error);
        }
    }

    static async updateRoom(id, roomData) {
        try {
            const room = await Room.findByPk(id);
            if (!room) {
                return notFoundResponse('Room');
            }
            const updatedRoom = await room.update(roomData);
            return successResponse(updatedRoom, 'Room updated successfully');
        } catch (error) {
            return errorResponse('Error updating room', 400, error);
        }
    }

    static async deleteRoom(id) {
        try {
            const room = await Room.findByPk(id);
            if (!room) {
                return notFoundResponse('Room');
            }
            await room.destroy();
            return successResponse(null, 'Room deleted successfully');
        } catch (error) {
            return serverErrorResponse(error);
        }
    }

    static async getAvailableRooms() {
        try {
            const availableRooms = await Room.findAll({
                where: { isAvailable: true }
            });
            return successResponse(availableRooms, 'Available rooms retrieved successfully');
        } catch (error) {
            return serverErrorResponse(error);
        }
    }

    static async bookedRooms() {
        try {
            const bookedRooms = await Room.findAll({
                where: { isAvailable: false }
            });
            return successResponse(bookedRooms, 'Booked rooms retrieved successfully');
        } catch (error) {
            return serverErrorResponse(error);
        }
    }
    
   static async getRoomByType(req, reply) {
     try {
       const { type } = req.params;
       const rooms = await Room.findAll({ where: { type } });
       reply.send(successResponse(rooms, 'Rooms fetched by type'));
     } catch (error) {
       logger.error('Failed to fetch rooms by type:', error);
       reply.code(500).send(serverErrorResponse(error));
     }
   }

  static async getRoomByPriceRange(req, reply) {
    try {
      const { minPrice, maxPrice } = req.query;
      const rooms = await Room.findAll({
        where: {
          price: {
            [Op.between]: [minPrice, maxPrice]
          }
        }
      }); 
    }catch (error) {
      logger.error('Failed to fetch rooms by price range:', error);
      reply.code(500).send(serverErrorResponse(error));
    }
  }

  static async getRoomAvailabilityByDate(req, reply) {
    try {
      const { date } = req.params;
      const rooms = await Room.findAll({
      where: {
        isAvailable: true
      },
      include: [{
        model: Booking,
        required: false, // LEFT JOIN
        where: {
          [Op.and]: [
            { checkIn: { [Op.lte]: date } },
            { checkOut: { [Op.gte]: date } }
          ]
        }
      }],
      // Only select rooms where no bookings overlap
      having: literal(`COUNT(Bookings.id) = 0`),
      group: ['Room.id']
    });

      reply.send(successResponse(rooms, 'Rooms fetched by availability date'));
    } catch (error) {
      logger.error('Failed to fetch rooms by availability date:', error);
      reply.code(500).send(serverErrorResponse(error));
    }
  }

}

export default RoomService;