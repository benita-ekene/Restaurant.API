import Joi from "joi"
import JoiMongoId from "joi-objectid"
const myJoiObjectId = JoiMongoId(Joi)


export const createNewItemValidator = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().min(10).max(255),
  price: Joi.number()
              .required()
              .min(100)
              .max(9000)
              .precision(2)
              .error(new Error('price must be a number between 100 and 9000, with a maximum of 2 decimal places')),
  rating: Joi.number()
              .min(1)
              .max(5)
              .precision(1)
              .error(new Error('rating must be a number between 1 and 5, in one decimal place')),
  category: Joi.string()
              .required(),
  image_url: Joi.string().required(),
  nutritional_info: Joi.object({
      ingredients: Joi.string(),
      calories:Joi.string()
  }),
  review:Joi.object({
    rating: Joi.number(),
    statement:Joi.string(),
    dateReviewed: Joi.string(),
}),
  }).strict()
 // tags: Joi.array().items(Joi.string()).min(1).max(5).unique().required(),


 export const addItemReviewValidator = Joi.object({
    rating: Joi.number()
               .precision(1)
               .min(1)
               .max(5)
               .error(new Error('rating must be a number between 1 and 5, in one decimal place')),
    statement:Joi.string(),
    dateReviewed: Joi.string(),
 }).strict()
