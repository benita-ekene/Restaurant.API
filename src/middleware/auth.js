import { UnAuthorizedError} from "../error/error.js"
import {verifyToken} from "../utils/jwt.js"
import {verifyUserToken, verifyRestaurantToken} from "../utils/jwt.js"

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

export function searchByKeywordMiddleware(req, res, next) {
  const { keyword } = req.query;

  if (keyword) {
    req.searchFilter = {
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { restaurantAddress: { $regex: keyword, $options: "i" } },
        { contactInfo: { $regex: keyword, $options: "i" } },
        { category: { $regex: keyword, $options: "i" } },
        { deliveryCategory: { $regex: keyword, $options: "i" } },
      ],
    };
  }

  next();
}


export function restaurantAut2hMiddleWare(req, res, next) {
  const { category } = req.query;

  if (!category) {
    return res.status(400).json({
      success: false,
      error: "Missing category parameter in req.query"
    });
  }

  next();
}

export function restaurantAuthMiddleWare(req, res, next){
  const token = req.headers?.authorization?.split(" ")[1];
  if(!token) throw new UnAuthorizedError("Not a registered restaurant. Provide a token!!")
  try {
    const payload = verifyRestaurantToken(token)
    req.restaurant = payload
    next()
  }catch (err){
    throw new UnAuthorizedError("Access denied, invalid token.")
  }
} 

// export function otpAuthMiddleWare(req, res, next){
//   const token = req.headers?.authorization?.split(" ")[1];
//   if(!token) throw new UnAuthorizedError("Provide a token!!")
//   try {
   
//     const payload = verifyOtp(otp)
//     req.user = payload
//     next()
//   }catch (err){
//     throw new UnAuthorizedError("Access denied, invalid token.")
//   }
// } 




