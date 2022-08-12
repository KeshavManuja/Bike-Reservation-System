import * as Joi from "joi"

export const SignupUserSchema = Joi.object({
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).trim().required(),
    name: Joi.string().min(3).max(30).required().trim(),
    password: Joi.string().min(4).required(),
    role: Joi.string().valid('regular', 'manager'),
  });

  export const LoginUserSchema = Joi.object({
    password: Joi.string().min(4).required(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).trim().required(),
  });

  export const UpdateUserSchema = Joi.object({
    id: Joi.number(),
    password: Joi.string().min(4),
    role:Joi.string().default('regular').valid('regular', 'manager'),
    name: Joi.string().min(3).max(30).required().trim(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).trim().required(),
  });