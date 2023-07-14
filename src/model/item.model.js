import { Schema, model, Types } from "mongoose"


const ItemSchema = new Schema({
  // customer: {
  //   type: Types.ObjectId,
  //   ref: "User",
  //   required: true,
  // },
   restaurant: {
      type: Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
      required: true
  },
    description: {
      type: String,
      required: true,
      min:10,
      max:255,
    },
    price: {
      type: Number,
      required: true,
     // max:6
    },
    rating: {
        type: Number,
       // max:2
       // required: true
      },
    category: {
        type: String,
        enum: ['specials', 'quick_fixes', 'extras'],
        default: 'specials',
        required: true
      },
    image_url: {
        type: String,
        required: true
      },
  //   nutrition_info: {
//       ingredients: {
//         type: String,
//         required: true
//       },
//       calories: {
//         type: String,
//         required: true
//       },
//  },
//  review: {
//       customer_name: {
//         type: String,
//         ref: "User",
//         //required: true,
//       },
//       customer_rating: {
//         type: String,
//         ref: "User",
//         //required: true,
//       },
//       statement: {
//         type: String,
//         ref: "User",
//        // required: true,
//       },
//       dateReviewed: {
//         type: Date,
//         ref: "User",
//         //default: new Date()
//       },
  //},
 // [{ text: String, date: {type:String, default: new Date()} }]
 
  }) 

export default model('Item', ItemSchema)