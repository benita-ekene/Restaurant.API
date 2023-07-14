import { UnAuthorizedError} from "../error/error.js"
import {verifyToken} from "../utils/jwt.js"

export function userAuthMiddleWare(req, res, next){
  const token = req.headers?.authorization?.split(" ")[1];
  if(!token) throw new UnAuthorizedError("You must provide an authorization token.")
  try {
    const payload = verifyToken(token)
    req.user = payload
    next()
  }catch (err){
    throw new UnAuthorizedError("Access denied, invalid token.")
  }
} 

export function restaurantAuthMiddleWare(req, res, next){
  const token = req.headers?.authorization?.split(" ")[1];
  if(!token) throw new UnAuthorizedError("Not a registered restaurant. Provide a token!!")
  try {
    const payload = verifyToken(token)
    req.restaurant = payload
    next()
  }catch (err){
    throw new UnAuthorizedError("Access denied, invalid token.")
  }
} 