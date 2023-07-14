import { Schema, model, Types, Query } from "mongoose";

const RestaurantSchema =new Schema(
{
  name: {
    type: String,
    required: true,
    //unique: true
  },
  restaurantAddress: {
    type: String,
    required: true,
    //unique: true
  },
  contactInfo: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true
  },
  image_url: {
    type: String,
    required: true
  },

//   customer: {
//     type: Types.ObjectId,
//     ref: "User",
//     required: true
//   }, 
//   customerId:String
},
{
  timestamps: true
})

export default model('Restaurant', RestaurantSchema)