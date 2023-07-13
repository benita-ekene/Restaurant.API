import express from 'express';
import UserController from '../controllers/user.controller.js'
import { tryCatchHandler } from '../utils/tryCatch.handler.js'
// import { otpAuthMiddleWare} from "../middleware/auth.js"

const router = new express.Router()

router.post("/signUp", tryCatchHandler( UserController.userSignUp) )

router.post("/verifyOtp", tryCatchHandler( UserController.verifyToken) )

router.post("/login", tryCatchHandler( UserController.userLogin) )

router.post('/otpActivation', tryCatchHandler( UserController.otpVerification) )

router.patch('/:id', tryCatchHandler( UserController.userUpdate) )

router.post('/forgotPassword', tryCatchHandler( UserController.forgotPassword) )

router.post('/password-reset/:userId/:token', tryCatchHandler( UserController.resetUserPassword) )

router.get('/find/:id', tryCatchHandler( UserController.findUser) )

router.post('/logout', tryCatchHandler( UserController.logOut) )

export { router }