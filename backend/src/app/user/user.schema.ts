const Joi = require('joi');

export const SignupUserSchema = Joi.object({
  name: Joi.string().min(3).max(30).required().trim(),
  password: Joi.string().min(4).required(),
  email: Joi.string().email().required().trim(),
  role: Joi.string().valid('regular', 'manager'),
});

export const LoginUserSchema = Joi.object({
  password: Joi.string().min(4).required(),
  email: Joi.string().email().required().trim(),
});

export const UserUpdateSchema = Joi.object({
  name: Joi.string().min(3).max(30).trim(),
  password: Joi.string().min(4),
  email: Joi.string().email().trim(),
  role: Joi.string().valid('regular', 'manager'),
  id: Joi.number(),
});
