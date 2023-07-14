import {Router} from "express"
import ItemController from "../controllers/item.controller.js"
import uploadImg from "../controllers/item.controller.js"
import { tryCatchHandler } from "../utils/tryCatch.handler.js"
import {restaurantAuthMiddleWare} from "../middleware/auth.js"
import {userAuthMiddleWare} from "../middleware/auth.js"

const router = Router()

router.post("/create", restaurantAuthMiddleWare , tryCatchHandler( ItemController.createNewItem))

//router.post("/image", tryCatchHandler(ItemController.uploadImage))

router.get("/item", userAuthMiddleWare, tryCatchHandler( ItemController.getItemDetails))

router.get("/by-category", userAuthMiddleWare,  tryCatchHandler( ItemController.findItemsByCategory))

router.get("/by-keyword", userAuthMiddleWare,  tryCatchHandler( ItemController.findItemsByKeyword))

router.get("/by-restaurant", userAuthMiddleWare, tryCatchHandler( ItemController.findItemsByRestaurant))

router.get("/info", userAuthMiddleWare, tryCatchHandler( ItemController.getNutritionInfo))

router.get("/cart", userAuthMiddleWare, tryCatchHandler( ItemController.addItemToCart))

router.get("/favourites", userAuthMiddleWare, tryCatchHandler( ItemController.addItemToFavourites))

router.post("/review", userAuthMiddleWare, tryCatchHandler( ItemController.addReview))

router.get("/allreviews", userAuthMiddleWare, tryCatchHandler( ItemController.getAllReviews))

router.delete("/delete", userAuthMiddleWare, tryCatchHandler( ItemController.removeFromFavourites))


export {router}

