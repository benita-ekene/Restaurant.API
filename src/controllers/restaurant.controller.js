import {createRestaurantValidator, categoryValidator, updateRestaurantValidator} from "../validators/restaurant.validator.js"
import Restaurant from "../model/restaurant.model.js"
import User from "../model/user.model.js"
import { BadUserRequestError, NotFoundError } from "../error/error.js"
import { mongoIdValidator } from "../validators/mongoId.validator.js"
import {getRestaurantToken} from "../utils/jwt.js"

export default class RestaurantController {

  static async createRestaurant(req, res,){
    const { error } = createRestaurantValidator.validate(req.body)
    if(error) throw error
    // const newRestaurant = await Restaurant.create({...req.body, customer: req.user._id, customerId: req.user._id })
    const nameExists = await Restaurant.find({ name: req.body.name })
    if (nameExists.length > 0) throw new BadUserRequestError("A restaurant with this name already exists.")
    const addressExists = await Restaurant.find({ restaurantAddress: req.body.restaurantAddress })
    if (addressExists.length > 0) throw new BadUserRequestError("A restaurant has been registered on this address.")

    const newRestaurant = await Restaurant.create( req.body )
    res.status(201).json({
    message: "Restaurant registered successfully",
    status: "Success",
    data:{
      restaurant: newRestaurant,
      vendor_token: getRestaurantToken(newRestaurant),
    }
  })
}


  // static async createRestaurant(req, res,){
  //     const {error } = createRestaurantValidator.validate(req.body)
  //     if(error) throw error
  //     const newRestaurant = await Restaurant.create({...req.body, user: req.user._id , userId: req.user._id })
  //     res.status(201).json({
  //     message: "Restaurant created successfully",
  //     status: "Success",
  //     data:{
  //       restaurant: newRestaurant
  //     }
  //   })
  // }


  
  
  static async searchAllrestaurants(req, res,){
      const restaurants = await Restaurant.find()
      res.status(201).json({
      message: "Restaurant found successfully",
      status: "Success",
      data:{
        restaurant: restaurants
      }
    })
  }


  static async searchRestaurantsByUsers(req, res) {
    const id = req.user._id
        const { error } = mongoIdValidator.validate(req.query)
        if( error ) throw new BadUserRequestError("Please pass in a valid mongoId")
    
        const user = await User.findById(id)
        if(!user) throw new NotFoundError(`The user with this id: ${id}, does not exist`)
    
        const restaurants =  await Restaurant.find({ customerId: id }).populate("customer")
    
        return res.status(200).json({
          message: restaurants.length < 1 ? "No Restaurants found" : "Restaurants found successfully",
          status: "Success",
          data: {
            restaurants: restaurants
          }
        })
      }


      
      static async searchByKeyword(req, res) {
        const { restaurants } = req.query;
      
        if (!restaurants) {
          throw new BadUserRequestError("Missing restaurants parameter in req.query");
        }
      
        const keyword = restaurants;
      
        const foundRestaurants = await Restaurant.find({
          $or: [
            { name: { $regex: keyword, $options: "i" } },
            { restaurantAddress: { $regex: keyword, $options: "i" } },
            { contactInfo: { $regex: keyword, $options: "i" } },
            { category: { $regex: keyword, $options: "i" } },
            { deliveryCategory: { $regex: keyword, $options: "i" } },
          ],
        });
      
        if (foundRestaurants.length === 0) {
          throw new NotFoundError(`No restaurants found for the keyword: ${keyword}`);
        }
      
        return res.status(200).json({
          message: "Restaurants found successfully",
          status: "Success",
          data: {
            restaurants: foundRestaurants
          }
        });
      }
      
      



  static async searchBycategory(req, res) {
    const { category } = req.query;
    const { error } = categoryValidator.validate(req.query)
    if( error ) throw new BadUserRequestError("Please pass in a valid mongoId")

    const restaurant = await Restaurant.findOne({ category: category })
    if(!restaurant) throw new NotFoundError(`The restaurant with this category: ${category}, does not exist`)

    return res.status(200).json({
      message: "Restaurant found successfully",
      status: "Success",
      data: {
        restaurant: restaurant
      }
    })
  }
  

  static async updateOneRestaurant(req, res){
    const { id } = req.query
    const { error } = mongoIdValidator.validate(req.query)
    if( error ) throw new BadUserRequestError("Please pass in a valid mongoId")

    const updateValidatorResponse = await updateRestaurantValidator.validate(req.body)
    const updateRestaurantError = updateValidatorResponse.error
    if(updateRestaurantError) throw updateRestaurantError

    const restaurant = await Restaurant.findById(id)
    if(!restaurant) throw new NotFoundError(`The Restaurant with this id: ${id}, does not exist`)

    const updatedRestaurant= await Restaurant.findByIdAndUpdate(id, req.body, {new: true})
    return res.status(200).json({
      message: "Restaurant updated successfully",
      status: "Success",
      data:{
        restaurant: updatedRestaurant
      }
    })
  }


  static async deleteOneRestaurant(req, res) {
    const { id } = req.query
    const { error } = mongoIdValidator.validate(req.query)
    if( error ) throw new BadUserRequestError("Please pass in a valid mongoId")

    const restaurant = await Restaurant.findById(id)
    if(!restaurant) throw new NotFoundError(`The Restaurant with this id: ${id}, does not exist`)

    await Restaurant.findByIdAndUpdate(id, {
      isDeleted: true
    })

    return res.status(200).json({
      message: "Restaurant deleted successfully",
      status: "Success",
    })
  }


 

}