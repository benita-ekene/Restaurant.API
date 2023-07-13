import Joi from "joi";

export const createRestaurantValidator = Joi.object({
  customer: Joi.objectId().required(),
  customerId: Joi.objectId().required(),
  name: Joi.string().required(),
  category: Joi.string().required(),
  deliveryCategory: Joi.string().required(),
  menu: Joi.array().required(),
  restaurantAddress: Joi.string().required(),
  contactInfo: Joi.string().required()
}).strict()


export const categoryValidator = Joi.object({
  category: Joi.string().required(),
  
}).strict()


// export const restaurantKeywordValidator = Joi.object({
//  name: Joi.string().required(),
//  restaurantAddress: Joi.string().required(),
//  contactInfo: Joi.string().required()

// }).strict()

export const updateRestaurantValidator = Joi.object({
  customer: Joi.objectId().required(),
  customerId: Joi.objectId().required(),
  name: Joi.string().required(),
  category: Joi.string().required(),
  restaurantAddress: Joi.string().required(),
  contactInfo: Joi.string().required()
}).strict()