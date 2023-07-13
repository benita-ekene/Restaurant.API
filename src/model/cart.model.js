import { Schema, model, Types } from "mongoose"


const CartSchema = new Schema({
    customer: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    orders: {
      type: [{
        itemId: {
          type: Types.ObjectId,
          ref: "Item",
        },
        itemName: {
          type: String,
          ref: "Item",
        },
        unit_price: {
          type: Number,
          ref: "Item",
        },
        quantity: {
           type: Number,
           default: 0,
          },
        total: {
            type: Number,
            default: 0,
          },
      }],
    },
    subtotal: {
      type: Number,
      default: 0,
    }
 },
{
  timestamps: true
}) 



export default model('Cart', CartSchema)
