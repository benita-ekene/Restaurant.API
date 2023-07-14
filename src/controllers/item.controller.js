import {createNewItemValidator, addItemReviewValidator} from "../validators/item.validator.js"
import Item from "../model/item.model.js"
import User from "../model/user.model.js"
import Restaurant from "../model/restaurant.model.js"
import { BadUserRequestError, NotFoundError, AccessDeniedError} from "../error/error.js"
import { mongoIdValidator } from "../validators/mongoId.validator.js"



// Controllers

export default class ItemController {

//   static async uploadImage(req, res,) {
//     uploadImg(req, res, (err) => {
//      if(err) {
//        res.status(400).send("Something went wrong!");
//      }
//      res.send(req.file);
//     //return res.file.path
//    });
//  }
  
// Registerd restaurant creates an item
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

// Display the details of an item 
  static async getItemDetails(req, res,){
    const id  = req.params.id
    const { error } = mongoIdValidator.validate(req.params)
    if( error ) throw new BadUserRequestError("Please pass in a valid mongoId for the item")

    const item = await Item.findOne({_id: id})
    if(!item) throw new NotFoundError(`The item with this id: ${id}, does not exist`)

    return res.status(200).json({
      message: "Item found!",
      status: "Success",
      data: {
        item: item
      }
    })
  }

// Display nutritional info of an item 
  static async getNutritionInfo(req, res,){ 
    const id  = req.params.id
    const { error } = mongoIdValidator.validate(req.params)
    if( error ) throw new BadUserRequestError("Please pass in a valid mongoId for the item")

    const item = await Item.findOne({_id: id})
    if(!item) throw new NotFoundError(`The item with this id: ${id}, does not exist`)
    
    return res.status(200).json({
      message: (item.nutritional_info.calories === undefined) || (item.nutritional_info.ingredients === undefined) ? " Not available for this item" :  "Info found!",
      status: "Success",
      data: {
        item_nutritionalInfo: item.nutritional_info
      }
    })
  }

// Displays all reviews available for an item
  static async getItemReviews(req, res,){
    const id  = req.params.id
    const { error } = mongoIdValidator.validate(req.params)
    if( error ) throw new BadUserRequestError("Please pass in a valid mongoId for the item")

    const item = await Item.findOne({_id: id})
    if(!item) throw new NotFoundError(`The item with this id: ${id}, does not exist`)

    return res.status(200).json({
      message: (item.review.length) < 1 ? " Not available for this item" :  "Reviews found!",
      status: "Success",
      data: {
        itemReviews: item.review
      }
    })
    
  }

  // Displays all items available for a restaurant
    static async findItemsByRestaurant(req, res) {
      const { id } = req.params
      
      const { error } = mongoIdValidator.validate(req.params)
      if( error ) throw new BadUserRequestError("Please pass in a valid mongoId for restauarant")
      
      const restaurant = await Restaurant.findById(id)
      if(!restaurant) throw new NotFoundError(`The restaurant with this id: ${id}, does not exist`)

      const items =  await Item.find({ restaurant: id, category: "specials" }).populate({path:"restaurant", select: " _id name" })
  
      return res.status(200).json({
        message: items.length < 1 ? " No items found" :  "Items found",
        status: "Success",
        data: {
          items,
        }
      })
    }

// Displays all items for the category selected by user
    static async findItemsByCategory(req, res) {
      const restaurantId = req.params.id 

      const { error } = mongoIdValidator.validate(req.params)
      if( error ) throw new BadUserRequestError("Please pass in a valid mongoId for restauarant")

      const restaurant = await Restaurant.findById(restaurantId)
      if(!restaurant) throw new NotFoundError(`The restaurant with this id: ${id}, does not exist`)

      const category = req.query.category
      const items =  await Item.find({ restaurant: restaurantId, category }).populate({ path:"restaurant", select: " _id name" })
  
      return res.status(200).json({
        message: items.length < 1 ? " No items found" :  "Items found",
        status: "Success",
        data: {
          items,
        }
      })
    }
    

 // Displays restaurant info and items available according to a keyword typed by the user
    static async findItemsByKeyword(req, res) {
      const keyword = req.params.keyword
      const items = await Item.find({ $text: { $search: keyword } }).populate({path:"restaurant", select: " _id name" })
      if( items.length < 1) throw new NotFoundError(`There are no items with the ${search_key} : ${search_value}`)
  
      return res.status(200).json({
        message: "Items found!",
        status: "Success",
        data: {
          items,
        }
      })
    }

    // Adds customer review for an item
    static async addReview(req, res,){
    const { id } = req.params
    const itemReviewValidatorResponse = await addItemReviewValidator.validate(req.body)
    const itemReviewError = itemReviewValidatorResponse.error
    if(itemReviewError) throw itemReviewError

    const { error } = mongoIdValidator.validate(req.params)
    if( error ) throw new BadUserRequestError("Please pass in a valid mongoId for the item")

    const item = await Item.findById(id)
    if(!item) throw new NotFoundError(`The item with this id: ${id}, does not exist`)

    // check if item review exists for customer and update with new review, else add customer review to all reviews 
    // then update the rating of the item based on new review 
    let noOfReviews = item.review.length
      if ((noOfReviews < 1) || (item.review[noOfReviews - 1].customer != req.user._id)){
      item.review.push({ ...req.body, customer: req.user._id })
      noOfReviews = noOfReviews + 1
    } else {
      item.review[noOfReviews - 1].rating = req.body.rating
      item.review[noOfReviews - 1].statement = req.body.statement
      console.log("Review updated") 
    }
      await item.save()
    
     let itemRating = (item.rating + req.body.rating)/2
     let ratingRounded = Math.round(itemRating*10)/10
     await item.updateOne({ rating: ratingRounded })
        
      res.status(201).json({
      message: "Review added successfully",
      status: "Success",
      data:{
        review: item.review[noOfReviews-1]
      }
    })
    
    }


  // Restaurant deletes an item
  static async deleteItem(req, res) {
     const { id } = req.params
     const { error } = mongoIdValidator.validate(req.params)
     if( error ) throw new BadUserRequestError("Please pass in a valid mongoId for item")

     const item = await Item.findById(id)
     if(!item) throw new NotFoundError(`The item with this id: ${id}, does not exist`)

     if(req.restaurant._id != item.restaurant) throw new AccessDeniedError(`Access Denied!!, You do not have the permission to delete this item`)

     await Item.findByIdAndUpdate(id, {
       isDeleted: true
    })
 
    return res.status(200).json({
       message: "Item successfully deleted",
       status: "Success",
    })
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

// {
//   "name": "Salad",
//   "description": "green salad garnished with snails",
//   "price": 1200,
//   "rating": 4.0,
//   "category": "quick_fixes",
//   "image_url": "uploads\\salad.jpeg",
//   "nutritional_info": {
//       "ingredients": "cucumber, egg, cabbage, milk",
//       "calories":"fat: 10g, protein: 20g"
//   },
//   "review":{
//       "rating": 4.0,
//       "statement": "nice meal"
//   }
// }