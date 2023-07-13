import Order from "../model/order.model.js"
import Cart from "../model/cart.model.js"
import CartController from "../controllers/cart.controller.js"
import { BadUserRequestError, NotFoundError} from "../error/error.js"
import { mongoIdValidator } from "../validators/mongoId.validator.js"


export default class OrderController {

    // Add checkout/concluded orders to the orders database
    static async checkOut(req, res,){
        const { id } = req.params
        const { error } = mongoIdValidator.validate(req.params)
        if( error ) throw new BadUserRequestError("Please pass in a valid mongoId for the cart")
    
        let cart = await Cart.findById(id)
        if(!cart) throw new NotFoundError(`The cart with this id: ${id}, does not exist`)

        // remove items with 0 quantity before moving to orders
        for (let obj of cart.orders){
            if (obj.quantity === 0) cart.orders.splice(obj, 1)
            cart = await cart.save();
        }
        //move cart to orders collection
        const newOrder = await Order.create({ 
            customer: cart.customer,
            orders: cart.orders
        })
        // empty cart for user
        const deleted = await Cart.findByIdAndDelete(id)

        res.status(201).json({
        message: "Cart emptied! Items successfully moved to orders.",
        status: "Success",
        moved_to_orders: newOrder
      })
   }
   
   // View all orders by  a user
    static async viewOrdersByUser(req, res,){
        const orders = await Order.find({customer: req.user._id})
        if (!orders)
        return res.status(404).json({ 
            message: "Order history does not exist for this user",
            status: "Failed" 
        });
    
       return res.status(200).json({ 
        message: "Orders found!",
        status: "Success", 
        order_history: orders 
       });
   }

   // Reorder an item from the orders view page
    static async reorderItem(req, res,){
     CartController.addItemToCart(req, res)
   }
   
   // View all orders from all customers
    static async viewAllOrders(req, res,){
        const orders = await Order.find()
        if (!orders)
        return res.status(404).json({ 
            message: "No order history",
            status: "Failed" 
        });
    
       return res.status(200).json({ 
           message: "Orders found!",
           status: "Success", 
           order_history: orders 
       });
   }

}