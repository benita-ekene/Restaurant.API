import express  from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import {globalErrorHandler} from "./src/utils/errorHandler.js"
import { config } from "./src/config/index.js";

import cors from "cors"
import {router as userRouter} from "./src/routers/user.route.js"
import {router as restaurantRouter} from "./src/routers/restaurant.route.js"
import {router as itemRouter} from "./src/routers/item.route.js"
import {router as cartRouter} from "./src/routers/cart.route.js"
import {router as orderRouter} from "./src/routers/order.route.js"


const app = express()

mongoose.connect(config.mongodb_connection_url).then(()=> console.log("Database connection established")).catch(e=> console.log("Mongo connection error: ", e.message))

const port = config.port || 4000;

// Enable CORS for all routes
app.use(cors());

app.use(morgan('tiny'))
app.use(express.json())

app.use('/api/v1/user', userRouter)
app.use('/api/v1/restaurant', restaurantRouter)
app.use('/api/v1/item', itemRouter)
app.use('/api/v1/cart', cartRouter)
app.use('/api/v1/order', orderRouter)


app.use(globalErrorHandler)


app.listen(port, ()=>{
  console.log(`Server runnning on port: ${port}`)
})