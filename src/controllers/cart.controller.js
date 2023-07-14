import Cart from "../model/cart.model.js"
import Item from "../model/item.model.js"
import { BadUserRequestError, NotFoundError} from "../error/error.js"
import { mongoIdValidator } from "../validators/mongoId.validator.js"



// Controllers

export default class CartController {

  // Add item to cart
   static async addItemToCart(req, res,){
      const itemId  = req.params.id
      const { error } = mongoIdValidator.validate(req.params)
      if( error ) throw new BadUserRequestError("Please pass in a valid mongoId for the item")

      const item = await Item.findOne({_id: itemId})
      if(!item) throw new NotFoundError(`The item with this id: ${itemId}, does not exist`)

      let cart = await Cart.findOne({customer: req.user._id})
      if (cart) {    // cart exists for the customer
       let itemIndex = cart.orders.findIndex((p) => p.itemId == itemId);
       if (itemIndex > -1) {      // item found in cart
        let orderItem = cart.orders[itemIndex]
        orderItem.quantity += 1
        orderItem.total += item.price
        cart.orders[itemIndex] = orderItem
        cart.subtotal += item.price
       } else { //item not found in cart
        cart.orders.push({ itemId: itemId, itemName: item.name, unit_price: item.price, quantity: 1, total: item.price });
        cart.subtotal += item.price
       }
      cart = await cart.save();
      return res.status(200).json({ 
         message: "Item successfully added to cart",
         status: "Success", 
         cart: cart
        });
      } else {    // cart does not exist for user
        const newCart = await Cart.create({
          customer: req.user._id,
          orders: [{ itemId: itemId, itemName: item.name, unit_price: item.price, quantity: 1, total: item.price }],
          subtotal: item.price
        });
        return res.status(201).json({
            message: "Cart successfully created for user",
            status: "Success", 
            cart: newCart
         });
      }
  }

  // View items in the cart
   static async viewCart(req, res,){
        let cart = await Cart.findOne({customer: req.user._id})
        if (!cart)
        return res.status(404).json({ 
            status: "Failed", 
            message: "Cart not found for this user" 
        });

        for (let obj of cart.orders){
            if (obj.quantity === 0) cart.orders.splice(obj, 1)
            cart = await cart.save();
        }
           
       return res.status(200).json({ 
        status: "Cart found!", 
        message: "Success",
        cart: cart 
       });
   }

   // Decrease the quantity of an item added to cart
   static async decreaseOrderQuantity(req, res,){
    const itemId  = req.params.id
    const { error } = mongoIdValidator.validate(req.params)
      if( error ) throw new BadUserRequestError("Please pass in a valid mongoId for the item")

    const item = await Item.findOne({_id: itemId})
    if(!item) throw new NotFoundError(`The item with this id: ${itemId}, does not exist`)

    let cart = await Cart.findOne({customer: req.user._id})
    if (!cart)
    return res.status(404).json({ 
        status: "Failed", 
        message: "Cart not found for this user" 
    });
    let itemIndex = cart.orders.findIndex((p) => p.itemId == itemId);
    let orderItem = cart.orders[itemIndex]
    if (itemIndex > -1 && orderItem.quantity != 0) {      // item found in cart and quantity is greater than one
        orderItem.quantity -= 1
        orderItem.total -= item.price
        cart.orders[itemIndex] = orderItem
        cart.subtotal -= item.price
        cart = await cart.save();
        return res.status(200).json({ 
            message: "Item quantity decreased successfully",
            status: "Success", 
            cart: cart 
        });
      }
    return res.status(400).json({ 
        message: "Item does not exist in cart" ,
        status: "Failed"
    });
}

  // Increase the quantity of an item added to cart
   static async increaseOrderQuantity(req, res,){
    const itemId  = req.params.id
    const { error } = mongoIdValidator.validate(req.params)
      if( error ) throw new BadUserRequestError("Please pass in a valid mongoId for the item")

    const item = await Item.findOne({_id: itemId})
    if(!item) throw new NotFoundError(`The item with this id: ${itemId}, does not exist`)

    let cart = await Cart.findOne({customer: req.user._id})
    if (!cart)
    return res.status(404).json({ 
        status: "Failed", 
        message: "Cart not found for this user" 
    });
    let itemIndex = cart.orders.findIndex((p) => p.itemId == itemId);
       if (itemIndex > -1) {      // item found in cart
        let orderItem = cart.orders[itemIndex]
        orderItem.quantity += 1
        orderItem.total += item.price
        cart.orders[itemIndex] = orderItem
        cart.subtotal += item.price
        cart = await cart.save();
        return res.status(200).json({ 
            message: "Item quantity increased successfully",
            status: "Success", 
            cart: cart 
        });
      }
    return res.status(400).json({ 
        message: "Item does not exist in cart" ,
        status: "Failed"
    });
  }
  

    // Delete an item from the orders
  static async deleteOrder(req, res,){
    const itemId  = req.params.id
    const { error } = mongoIdValidator.validate(req.params)
      if( error ) throw new BadUserRequestError("Please pass in a valid mongoId for the item")

    const item = await Item.findOne({_id: itemId})
    if(!item) throw new NotFoundError(`The item with this id: ${itemId}, does not exist`)

    let cart = await Cart.findOne({customer: req.user._id})
    if (!cart)
    return res.status(404).json({ 
        status: "Failed", 
        message: "Cart not found for this user" 
    });
    let itemIndex = cart.orders.findIndex((p) => p.itemId == itemId);
       if (itemIndex > -1) {      // item found in cart
        cart.orders.splice(itemIndex, 1);
        cart.subtotal -= item.price
        cart = await cart.save();
        return res.status(200).json({ 
            message: "Item removed successfully",
            status: "Success", 
            cart: cart 
        });
      }
    return res.status(400).json({ 
        message: "Item does not exist in cart" ,
        status: "Failed"
    });

    }


    // Delete cart for user
  static async deleteCart(req, res,){
    const cartId  = req.params.id
    const { error } = mongoIdValidator.validate(req.params)
    if( error ) throw new BadUserRequestError("Please pass in a valid mongoId for the cart")

    const userCart = await Cart.findOne({_id: cartId})
    if(!userCart) throw new NotFoundError(`The cart with this id: ${cartId}, does not exist`)

    let cart = await Cart.findByIdAndDelete({customer: req.user._id , _id: cartId})
    if (!cart)
    return res.status(404).json({ 
      message: "Cart not found for this user" ,
      status: "Failed", 
    });
    
    return res.status(400).json({ 
        message: "Cart deleted successfully" ,
        status: "Success"
    });

    }

   
}

