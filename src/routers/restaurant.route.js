import express from 'express';
import RestaurantController from '../controllers/restaurant.controller.js'
import { tryCatchHandler } from '../utils/tryCatch.handler.js'

import {userAuthMiddleWare} from "../middleware/auth.js"

const router = new express.Router()

router.post("/create", userAuthMiddleWare, tryCatchHandler( RestaurantController.createRestaurant) )

router.get("/by-category", userAuthMiddleWare, tryCatchHandler( RestaurantController.findRestaurantsByCategory) )

router.get("/by-keyword", userAuthMiddleWare, tryCatchHandler( RestaurantController.findRestaurantsByKeyword) )

router.get("/", tryCatchHandler( RestaurantController.findRestaurant) )

router.get('/:id', tryCatchHandler( RestaurantController.findRestaurant) )

router.put('/:id', tryCatchHandler( RestaurantController.findRestaurant) )

router.delete('/:id', tryCatchHandler( RestaurantController.deleteOneRestaurant) )


export { router }