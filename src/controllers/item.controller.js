import {createNewItemValidator} from "../validators/item.validator.js"
import Item from "../model/item.model.js"
//import User from "../model/user.model.js"
import Restaurant from "../model/restaurant.model.js"
import { BadUserRequestError, NotFoundError} from "../error/error.js"
import { mongoIdValidator } from "../validators/mongoId.validator.js"
//import multer from "multer"
// const upload = multer({dest:'uploads/'}).single("demo_image");



// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//       cb(null, './uploads');
//     },
//   filename: function (req, file, cb) {
//       cb(null, file.originalname);
//   }
// });
// export const uploadImg = multer({storage: storage}).single('demo_image');
// const imageUrl = ""


// Controllers

export default class ItemController {

  static async uploadImage(req, res,) {
    uploadImg(req, res, (err) => {
     if(err) {
       res.status(400).send("Something went wrong!");
     }
     res.send(req.file);
    //return res.file.path
   });
 }
  
  static async createNewItem(req, res,){
    const { error } = createNewItemValidator.validate(req.body)
    if(error) throw error
    const newItem = await Item.create({ ...req.body,  restaurant: req.restaurant._id })

    res.status(201).json({
    message: "Item successfully created",
    status: "Success",
    data:{
      item: newItem
    }
  })
}

  static async getItemDetails(req, res,){
    const { id } = req.query
    const item = await Item.findOne({id: id})
    if(!item) throw new NotFoundError(`The item with this id: ${id}, does not exist`)

    return res.status(200).json({
      message: "Item found!",
      status: "Success",
      data: {
        item: item
      }
    })
  }


  static async getNutritionInfo(req, res,){ 

  }

  static async findItemsByCategory(req, res) {
      const  search_key = (Object.keys(req.query))[0] 
      const search_value = (Object.values(req.query))[0]
      const queryObj = {}
      queryObj[search_key] = search_value
      
      const { error } = mongoIdValidator.validate(queryObj)
      if( error ) throw new BadUserRequestError("Please pass in a valid mongoId for restaurant")
      
      const restaurantId = req.query.id 
      const restaurant = await Restaurant.findById(restaurantId)
      if(!restaurant) throw new NotFoundError(`The restaurant with this id: ${id}, does not exist`)

      const category = req.query.category
      const items =  await Item.find({ restaurant: restaurantId, category }).populate("restaurant")
  
      return res.status(200).json({
        message: items.length < 1 ? " No items found" :  "Items found",
        status: "Success",
        data: {
          items,
        }
      })
    }

    static async findItemsByRestaurant(req, res) {
      const  search_key = (Object.keys(req.query))[0] 
      const search_value = (Object.values(req.query))[0]
      const queryObj = {}
      queryObj[search_key] = search_value
      
      const { error } = mongoIdValidator.validate(queryObj)
      if( error ) throw new BadUserRequestError("Please pass in a valid mongoId for restauarant")
      
      const restaurantId = req.query.id 
      const restaurant = await Restaurant.findById(restaurantId)
      if(!restaurant) throw new NotFoundError(`The restaurant with this id: ${id}, does not exist`)

      const category = req.query.category
      const items =  await Item.find({ restaurant: restaurantId, category: "specials" }).populate("restaurant")
  
      return res.status(200).json({
        message: items.length < 1 ? " No items found" :  "Items found",
        status: "Success",
        data: {
          items,
        }
      })
    }

    static async findItemsByKeyword(req, res) {
      const search_key = (Object.keys(req.query))[0] 
      const search_value = (Object.values(req.query))[0]
      const queryObj = {}
      queryObj[search_key] = search_value
      //console.log(queryObj)
      const items = await Item.find(queryObj).populate("restaurant")
      if( items.length < 1) throw new NotFoundError(`There are no items with the ${search_key} : ${search_value}`)
  
      return res.status(200).json({
        message: "Items found!",
        status: "Success",
        data: {
          items,
        }
      })
    }



  static async addItemToCart(req, res,){

}
  static async addItemToFavourites(req, res,){

}
  static async addReview(req, res,){

}
  static async getAllReviews(req, res,){

}
  static async removeFromFavourites(req, res,){

}

}


// const newItem = new Item({
//   name:req.body.name,
//   picture: req.file.meal1.jpg,  //update this
//   description: req.body.description,
//   price: req.body.price,
//   rating: req.body.origin,
//   category: req.body.category,
//   restaurant: req.body.restaurant,
// })


// {
//     "restaurant": "6477bf16d6749b7d9487bb95",
//     "name": "Bread and Egg",
//     "description": "Succulent sliced bread with fried egg and tea",
//     "price": 3000,
//     "rating": "4.5",
//     "category": "specials",
//     "demo_image": "uploads\\egg1.jpeg"
// }