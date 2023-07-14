import {Router} from "express"
import CategoryController from "../controllers/category.controller.js"
import { tryCatchHandler} from "../utils/tryCatch.handler.js"
import {userAuthMiddleWare} from "../middleware/auth.js"

const router = Router()

router.post("/create", userAuthMiddleWare, tryCatchHandler( CategoryController.createCategory))

router.put("/update", userAuthMiddleWare, tryCatchHandler( CategoryController.updateOneCategory))

router.get("/one", userAuthMiddleWare, tryCatchHandler( CategoryController.getOneCategory))

router.get("/all_category", userAuthMiddleWare, tryCatchHandler( CategoryController.findAll))

router.delete("/delete",  userAuthMiddleWare, tryCatchHandler( CategoryController.deleteOneCategory))

export {router}