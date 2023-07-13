import {Router} from "express"
import CartController from "../controllers/cart.controller.js"
import { tryCatchHandler } from "../utils/tryCatch.handler.js"
import {userAuthMiddleWare} from "../middleware/auth.js"

const router = Router()

router.post("/add/:id", userAuthMiddleWare, tryCatchHandler( CartController.addItemToCart))

router.get("/view", userAuthMiddleWare, tryCatchHandler( CartController.viewCart))

router.post("/increase/:id", userAuthMiddleWare, tryCatchHandler( CartController.increaseOrderQuantity))

router.post("/decrease/:id", userAuthMiddleWare, tryCatchHandler( CartController.decreaseOrderQuantity))

router.delete("/delete/:id", userAuthMiddleWare, tryCatchHandler( CartController.deleteOrder))

router.delete("/clear/:id", userAuthMiddleWare, tryCatchHandler( CartController.deleteCart))



export {router}