import {Router} from "express"
import ItemController from "../controllers/item.controller.js"
import { tryCatchHandler } from "../utils/tryCatch.handler.js"
import {restaurantAuthMiddleWare} from "../middleware/auth.js"
import {userAuthMiddleWare} from "../middleware/auth.js"

const router = Router()

router.post("/create", restaurantAuthMiddleWare, tryCatchHandler( ItemController.createNewItem))

router.get("/details/:id", tryCatchHandler( ItemController.getItemDetails))

router.get("/nutri-info/:id", tryCatchHandler( ItemController.getNutritionInfo))

router.get("/all-reviews/:id", tryCatchHandler( ItemController.getItemReviews))

router.get("/by-restaurant/:id", tryCatchHandler( ItemController.findItemsByRestaurant))

router.get("/by-category/:id",  tryCatchHandler( ItemController.findItemsByCategory))

router.get("/by-keyword/:keyword", userAuthMiddleWare,  tryCatchHandler( ItemController.findItemsByKeyword))

router.post("/review/:id", userAuthMiddleWare, tryCatchHandler( ItemController.addReview))

router.delete("/delete/:id", restaurantAuthMiddleWare, tryCatchHandler( ItemController.deleteItem))


//router.post("/image", tryCatchHandler(ItemController.uploadImage))

export {router}
