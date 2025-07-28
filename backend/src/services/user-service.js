import bcrypt from 'bcrypt';
import { createUserSchema, updateUserSchema } from '../utils/joiValidation.js';
import logger from '../utils/logger.js';
import {successResponse,errorResponse,notFoundResponse,serverErrorResponse} from '../utils/responseHelper.js';
import { User } from '../model/user_model.js';
import { Booking } from '../model/booking_model.js';

const SALT_ROUNDS = 10;

class UserService {
  static async createUser(req, reply) {
    try {
      const { error, value } = createUserSchema.validate(req.body);
      if (error) {
        return reply
          .code(400)
          .send(errorResponse(error.details[0].message, 400, error));
      }

      const existingUser = await User.findOne({
        where: { email: value.email }
      });
      if (existingUser) {
        return reply
          .code(409)
          .send(errorResponse('Email already exists', 409));
      }

      const hashedPassword = await bcrypt.hash(value.password, SALT_ROUNDS);

      const user = await User.create({
        ...value,
        password: hashedPassword
      });

      const { password, ...safeUser } = user.toJSON();
      reply.code(201).send(successResponse(safeUser, 'User created', 201));
    } catch (error) {
      logger.error('User creation failed:', error);
      reply.code(500).send(serverErrorResponse(error));
    }
  }

  static async getUserById(req, reply) {
    try {
      const user = await User.findByPk(req.params.id, {
        attributes: { exclude: ['password'] }
      });

      if (!user) {
        return reply.code(404).send(notFoundResponse('User'));
      }

      reply.send(successResponse(user, 'User fetched'));
    } catch (error) {
      logger.error('Failed to fetch user:', error);
      reply.code(500).send(serverErrorResponse(error));
    }
  }

  static async updateUser(req, reply) {
    try {
      const { error, value } = updateUserSchema.validate(req.body);
      if (error) {
        return reply
          .code(400)
          .send(errorResponse(error.details[0].message, 400, error));
      }

      const user = await User.findByPk(req.params.id);
      if (!user) {
        return reply.code(404).send(notFoundResponse('User'));
      }

      if (value.password) {
        value.password = await bcrypt.hash(value.password, SALT_ROUNDS);
      }

      await user.update(value);
      const { password, ...updatedUser } = user.toJSON();
      reply.send(successResponse(updatedUser, 'User updated'));
    } catch (error) {
      logger.error('User update failed:', error);
      reply.code(500).send(serverErrorResponse(error));
    }
  }

  static async deleteUser(req, reply) {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user) {
        return reply.code(404).send(notFoundResponse('User'));
      }

      await user.destroy();
      reply.send(successResponse(null, 'User deleted successfully'));
    } catch (error) {
      logger.error('User deletion failed:', error);
      reply.code(500).send(serverErrorResponse(error));
    }
  }

  static async getUserBookings(req, reply) {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user) {
        return reply.code(404).send(notFoundResponse('User'));
      }

      const bookings = await Booking.findAll({
        where: { userId: user.id },
        include: [{ model: Room, attributes: ['id', 'name', 'price'] }]
      });

      reply.send(successResponse(bookings, 'User bookings fetched'));
    } catch (error) {
      logger.error('Failed to fetch user bookings:', error);
      reply.code(500).send(serverErrorResponse(error));
    }
  }

 static async login(req, reply) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return reply.code(400).send(errorResponse('Email and password are required', 400));
    }

    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      return reply.code(401).send(errorResponse('Invalid email or password', 401));
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return reply.code(401).send(errorResponse('Invalid email or password', 401));
    }

    const token = req.server.jwt.sign({ id: user.id, isAdmin: user.isAdmin });
    // reply.setCookie('token', token, { 
    //   httpOnly: true,
    //   maxAge: 24 * 60 * 60 * 1000, // 1 day expiration
    //   path: '/'
    // });
    
    const { password: _, ...safeUser } = user.toJSON();
    return reply.send(successResponse({ ...safeUser, token }, 'Login successful'));
    
  } catch (error) {
    logger.error('Login failed:', error);
    return reply.code(500).send(serverErrorResponse(error));
  }
}

static async getUserBookingHistory(req, reply) {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return reply.code(404).send(notFoundResponse('User'));
    }

    const today = new Date();

    const bookings = await Booking.findAll({
      where: {
        userId: user.id,
        checkOut: { [sequelize.Op.lt]: today } 
      },
      include: [
        {
          model: Room,
          attributes: ['id', 'number', 'type', 'price']
        }
      ],
      order: [['checkOut', 'DESC']]
    });

    reply.send(successResponse(bookings, 'User booking history fetched'));
  } catch (error) {
    logger.error('Failed to fetch booking history:', error);
    reply.code(500).send(serverErrorResponse(error));
  }
}

}


export default UserService;