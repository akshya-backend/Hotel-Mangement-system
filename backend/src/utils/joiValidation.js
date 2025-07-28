import Joi from 'joi';

export const createUserSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(4).required(),
  isAdmin: Joi.boolean().default(false)

});

export const updateUserSchema = Joi.object({
  name: Joi.string(),
  email: Joi.forbidden(), // Email cannot be updated
  password: Joi.string().min(4),
  isAdmin: Joi.boolean()
}).min(1); 