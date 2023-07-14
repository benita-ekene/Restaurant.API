import Joi from "joi"
import JoiMongoId from "joi-objectid"

Joi.objectId = JoiMongoId(Joi)

export const createCategoryValidator = Joi.object({
  creator: Joi.objectId().required(),
  creatorId: Joi.objectId().required(),
  status: Joi.string().valid('pending', 'in-progress', 'completed').required(),
  title: Joi.string().required(),
  startDate: Joi.string().required(),
  endDate: Joi.string().required(),
}).strict()



export const updateCategoryValidator = Joi.object({
   creator: Joi.objectId().required(),
  creatorId: Joi.objectId().required(),
  status: Joi.string().valid('pending', 'in-progress', 'completed').required(),
  title: Joi.string().optional(),
  startDate: Joi.string().optional(),
  endDate: Joi.string().optional(),
}).strict()
