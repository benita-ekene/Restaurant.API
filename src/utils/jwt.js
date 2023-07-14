import jwt, { verify } from "jsonwebtoken"
import {config} from "../config/index.js"

export function generateToken(user){
  const payload = {
    _id: user._id,
    email: user.email,
    userName: user.userName
  }
  const token = jwt.sign(payload, config.jwt_secret_key, { expiresIn: 60 * 60 * 24 });
  return token 
}

export function getRestaurantToken(restaurant){
  const payload = {
    _id: restaurant._id,
    name: restaurant.name,
    restaurantAddress: restaurant.restaurantAddress,
    contactInfo: restaurant.contactInfo
  }
  const token = jwt.sign(payload, config.jwt_secret_key, {});
  return token 
}

export function verifyToken(token){
 return jwt,verify(token, config.jwt_secret_key)
}