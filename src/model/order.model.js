import { Schema, model, Types } from "mongoose"


const OrderSchema = new Schema({
  customer: {
    type: Types.ObjectId,
    ref: "Cart",
    required: true,
  },
  orders: {
    type: Array,
    ref:"Cart"
  },
    
},
{
timestamps: true
}) 

export default model('Order', OrderSchema)