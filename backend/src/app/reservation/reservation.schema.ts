const Joi = require('joi');

export const BookReservationSchema = Joi.object({
  bikeId: Joi.number().integer().required(),
  fromDate: Joi.date().greater(Date.now()).required(),
  toDate: Joi.date().greater(Date.now()).greater(Joi.ref('fromDate')).required(),
  status: Joi.string().trim(),
  userId: Joi.number().required(),
  rating: Joi.number().integer().min(1).max(5).required(),
  hasRated: Joi.boolean(),
});

export const AddRatingSchema = Joi.object({
  userID: Joi.number().required(),
  id: Joi.number().integer().required(),
  rating: Joi.number().integer().min(1).max(5).required(),
});
