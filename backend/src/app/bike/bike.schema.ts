const Joi = require('joi');
export const bikeSchema = Joi.object({
  model: Joi.string().min(3).max(30).trim().required(),
  color: Joi.string().required().trim(),
  rating: Joi.number().default(0),
  location: Joi.string().min(3).max(30).required().trim(),
  isAvailable: Joi.boolean().default(true).required(),
});

export const getBikesSchema = Joi.object({
  model: Joi.string().min(3).max(30).trim(),
  color: Joi.string().trim(),
  rating: Joi.number().integer().min(1).max(5),
  location: Joi.string().min(3).max(30).trim(),
  fromDate: Joi.date().min('now'),
  toDate: Joi.date().min(Joi.ref('fromDate')),
  isAvailable: Joi.boolean(),
  page: Joi.number().default(1),
  limit: Joi.number().default(4),
});

export const patchBikeSchema = Joi.object({
  id: Joi.number(),
  model: Joi.string().min(3).max(30).trim(),
  color: Joi.string().trim(),
  rating: Joi.number().integer().min(1).max(5),
  location: Joi.string().min(3).max(30).trim(),
  isAvailable: Joi.boolean(),
});
