import * as Joi from "joi";

export const filterBikesSchema = Joi.object({
  model: Joi.string().min(3).max(30).allow("").trim(),
  color: Joi.string().allow("").trim(),
  rating: Joi.number().integer().min(1).max(5).allow(""),
  location: Joi.string().min(3).max(30).allow("").trim(),
  fromDate: Joi.date().min("now").allow(null),
  toDate: Joi.date()
    .min(Joi.ref("fromDate"))
    .error(new Error("End date must be greater than equal to start date"))
    .allow(null),
  isAvailable: Joi.boolean().default(true),
});

export const BikeSchema = Joi.object({
  id: Joi.number(),
  model: Joi.string().min(3).max(30).required(),
  color: Joi.string().required(),
  rating: Joi.number().integer().min(1).max(5),
  location: Joi.string().min(3).max(30).required(),
  isAvailable: Joi.boolean().default(true),
});

export const AddRatingSchema = Joi.object({
  id: Joi.number().required(),
  rating: Joi.number().integer().min(1).max(5).required(),
  userID: Joi.number().required(),
});
