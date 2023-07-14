import {createCategoryValidator, updateCategoryValidator} from "../validators/Category.validator.js"
import Category from "../model/category.model.js"
import User from "../model/user.model.js"
import { BadUserRequestError, NotFoundError } from "../error/error.js"
import { mongoIdValidator } from "../validators/mongoId.validator.js"

export default class CategoryController {
  static async createCategory(req, res,){
      const {error } = createCategoryValidator.validate(req.body)
      if(error) throw error
      const newCategory = await Category.create({...req.body, restaurant: req.user._id, restaurantId: req.user._id })
      res.status(201).json({
      message: "Category created successfully",
      status: "Success",
      data:{
        category: newCategory
      }
    })
  }

  static async updateOneCategory(req, res){
    const { id } = req.query
    const { error } = mongoIdValidator.validate(req.query)
    if( error ) throw new BadUserRequestError("Please pass in a valid mongoId")

    const updateValidatorResponse = await updateCategoryValidator.validate(req.body)
    const updateCategoryError = updateValidatorResponse.error
    if(updateCategoryError) throw updateCategoryError

    const category = await Category.findById(id)
    if(!category) throw new NotFoundError(`The Category with this id: ${id}, does not exist`)

    const updatedCategory = await Category.findByIdAndUpdate(id, req.body, {new: true})
    return res.status(200).json({
      message: "Category updated successfully",
      status: "Success",
      data:{
        category: updatedCategory
      }
    })
  }



  static async getOneCategory(req, res) {
    const { id } = req.query
    const { error } = mongoIdValidator.validate(req.query)
    if( error ) throw new BadUserRequestError("Please pass in a valid mongoId")

    const category = await Category.findById(id)
    if(!category) throw new NotFoundError(`The Category with this id: ${id}, does not exist`)

    return res.status(200).json({
      message: "Category found successfully",
      status: "Success",
      data: {
        category: category
      }
    })
  }


  static async deleteOneCategory(req, res) {
    const { id } = req.query
    const { error } = mongoIdValidator.validate(req.query)
    if( error ) throw new BadUserRequestError("Please pass in a valid mongoId")

    const category = await Category.findById(id)
    if(!category) throw new NotFoundError(`The Category with this id: ${id}, does not exist`)

    await Category.findByIdAndUpdate(id, {
      isDeleted: true
    })


    return res.status(200).json({
      message: "Category deleted successfully",
      status: "Success",
    })
  }


  static async findAll(req, res) {
const id = req.user._id
    const { error } = mongoIdValidator.validate(req.query)
    if( error ) throw new BadUserRequestError("Please pass in a valid mongoId")

    const user = await User.findById(id)
    if(!user) throw new NotFoundError(`The user with this id: ${id}, does not exist`)

    const categories =  await Category.find({ itemId: id }).populate("item")

    return res.status(200).json({
      message: categories.length < 1 ? "No categories found" : "Categories found successfully",
      status: "Success",
      data: {
        categories: categories
      }
    })
  }
}