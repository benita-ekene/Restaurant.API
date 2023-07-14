import Joi from "joi"
import JoiMongoId from "joi-objectid"
const myJoiObjectId = JoiMongoId(Joi)


export const createNewItemValidator = Joi.object({
  restaurant: Joi.objectId().required(),  
  name: Joi.string().required(),
  description: Joi.string().min(10).max(255),
  price: Joi.number()
            //.max(6)
            //.precision(2)
            .required(),
           // .message("Price cannot be more than 6 digts in 2 decimal places e.g ####.##"),
   rating: Joi.number(),
           // .max(2),
            //.precision(1),
            //.message("Must be 2 digits in 1 decimal place"),
 
  category: Joi.string().required(),
//   restaurant: Joi.string().required(),
  image_url: Joi.string().required(),
  }).strict()


