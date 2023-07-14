import {createRestaurantValidator, updateCategoryValidator} from "../validators/restaurant.validator.js"
import Restaurant from "../model/restaurant.model.js"
import User from "../model/user.model.js"
import {getRestaurantToken} from "../utils/jwt.js"
import { BadUserRequestError, NotFoundError } from "../error/error.js"
import { mongoIdValidator } from "../validators/mongoId.validator.js"

export default class RestaurantController {
  
  static async createRestaurant(req, res,){
      const { error } = createRestaurantValidator.validate(req.body)
      if(error) throw error
      // const newRestaurant = await Restaurant.create({...req.body, customer: req.user._id, customerId: req.user._id })
      const nameExists = await Restaurant.find({ name: req.body.name })
      console.log(nameExists.length)
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

  static async findRestaurantsByCategory(req, res) {
    const {category} = req.query 
    const restaurants = await Restaurant.find({ category:category })
    if(!restaurants) throw new NotFoundError(`No restaurant exists in the category: ${category}`)

     return res.status(200).json({
      message: restaurants.length < 1 ? " No restaurants found" :  "Restaurants found",
      status: "Success",
      data: {
        restaurants
      }
    })
  }

  static async findRestaurantsByKeyword(req, res) {
    const search_key = (Object.keys(req.query))[0] 
    const search_value = (Object.values(req.query))[0]
    const queryObj = {}
    queryObj[search_key] = search_value

    let restaurants = await Restaurant.find(req.query)
    if (search_key == "restaurantAddress") { restaurants = await Restaurant.find({ "restaurantAddress": { $regex: search_value}})}
    if( restaurants.length < 1) throw new NotFoundError(`There are no restaurants with the ${search_key} : ${search_value}`)

    return res.status(200).json({
      message: "Restaurants found!",
      status: "Success",
      data: {
        restaurants,
      }
    })
  }

  //=========================================================================================

  static async updateOneRestaurant(req, res){
    const { id } = req.query
    const { error } = mongoIdValidator.validate(req.query)
    if( error ) throw new BadUserRequestError("Please pass in a valid mongoId")

    const updateValidatorResponse = await updateRestaurantValidator.validate(req.body)
    const updateRestaurantError = updateValidatorResponse.error
    if(updateRestaurantError) throw updateRestaurantError

    const restaurant = await Restaurant.findById(id)
    if(!restaurant) throw new NotFoundError(`The Restaurant with this id: ${id}, does not exist`)

    const updatedRestaurant = await Restaurant.findByIdAndUpdate(id, req.body, {new: true})
    return res.status(200).json({
      message: "Restaurant updated successfully",
      status: "Success",
      data:{
        restaurant: updatedRestaurant
      }
    })
  }


  static async getOneRestaurant(req, res) {
    const { id } = req.query
    const { error } = mongoIdValidator.validate(req.query)
    if( error ) throw new BadUserRequestError("Please pass in a valid mongoId")

    const restaurant = await Restaurant.findById(id)
    if(!restaurant) throw new NotFoundError(`The Restaurant with this id: ${id}, does not exist`)

    return res.status(200).json({
      message: "Restaurant found successfully",
      status: "Success",
      data: {
        restaurant: restaurant
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


  static async findAll(req, res) {
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

}