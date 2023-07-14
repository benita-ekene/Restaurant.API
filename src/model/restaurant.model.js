import { Schema, model, Types, Query } from "mongoose";

const RestaurantSchema =new Schema(
{
  name: {
    type: String,
    required: true,
    unique: true
  },
  category: {
    type: String,
    required: true,
  },
  deliveryCategory: {
    type: String,
    required: true,
  },
  
  menu: {
    type: Array,
    required: true,
  },
  
restaurantAddress: {
    type: String,
    required: true
  },
  contactInfo: {
    type: String,
    required: true
  },
  
  customer: {
    type: Types.ObjectId,
    ref: "User",
    required: true
  }, 
  customerId:String
},{
  timestamps: true
})

export default model("Restaurant", RestaurantSchema)