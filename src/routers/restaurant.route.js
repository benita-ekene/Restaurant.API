import express from 'express';
import RestaurantController from '../controllers/restaurant.controller.js'
import { tryCatchHandler } from '../utils/tryCatch.handler.js'
import {userAuthMiddleWare, searchByKeywordMiddleware, restaurantAut2hMiddleWare} from "../middleware/auth.js"


const router = new express.Router()

router.post("/create", userAuthMiddleWare, tryCatchHandler( RestaurantController.createRestaurant) )

router.get("/searchBycreator", userAuthMiddleWare, tryCatchHandler( RestaurantController.searchRestaurantsByUsers))

router.get("/all-restaurants",  tryCatchHandler( RestaurantController.searchAllrestaurants))

router.get("/keyword", searchByKeywordMiddleware, tryCatchHandler( RestaurantController.searchByKeyword) )

router.get("/:category", searchByKeywordMiddleware, tryCatchHandler( RestaurantController.searchBycategory) )

router.put("/update", userAuthMiddleWare, tryCatchHandler( RestaurantController.updateOneRestaurant))

router.delete("/delete", userAuthMiddleWare, tryCatchHandler( RestaurantController.deleteOneRestaurant) )




export { router }