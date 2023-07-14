import { Schema, model, Types, Query} from "mongoose"


const CategorySchema = new Schema({
  title: {
    type: String,
    required: true
},
restaurant: {
    type: Types.ObjectId,
    ref: 'Restaurant',
},
restaurantId:String,
menu: {
  type: Types.ObjectId,
  ref: 'Menu',
},
itemId:String,
item: [{
    type: Types.ObjectId,
    ref: 'Item'
}],
created_at: {
    type: Date,
    default: Date.now
},
});

CategorySchema.pre(/^find/, function (next){
if (this instanceof Query) {
    this.where({ isDeleted: { $ne: true } }); 
  }  
  next()
})

export default model('Category', CategorySchema)