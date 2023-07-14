import { Schema, model, Types, Query } from "mongoose"


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
        enum: { 
          values: ['specials', 'quick_fixes', 'extras'], 
          message: '{VALUE} is not supported'
        },
        default: 'specials',
        lowercase: true,
        required: true
      },
    image_url: {
        type: String,
        required: true
      },
    nutritional_info: {
      ingredients: String,
      calories: String,
  },
   review: {
      type: [{
        customer: {
          type: Types.ObjectId,
          ref: "User",
        },
        rating : Number,
        statement: String,
        dateReviewed: {
            type: String,
            default: new Date()
          },
      }],
}
   
}) 

  ItemSchema.pre(/^find/, function (next){
    if (this instanceof Query) {
      this.where({ isDeleted: { $ne: true } }); 
    }  
    next()
  })

  ItemSchema.index({ "name": "text", "description": "text", "category": "text"});

export default model('Item', ItemSchema)