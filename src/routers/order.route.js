import {Router} from "express"
import OrderController from "../controllers/order.controller.js"
import { tryCatchHandler } from "../utils/tryCatch.handler.js"
import {userAuthMiddleWare} from "../middleware/auth.js"

const router = Router()

router.post ("/checkout/:id", userAuthMiddleWare, tryCatchHandler( OrderController.checkOut))

router.get("/by-user", userAuthMiddleWare, tryCatchHandler( OrderController.viewOrdersByUser))

router.get("/all", tryCatchHandler( OrderController.viewAllOrders))

router.post("/reorder/:id", userAuthMiddleWare, tryCatchHandler( OrderController.reorderItem))



export {router}