import express  from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import {globalErrorHandler} from "./src/utils/errorHandler.js"
import { config } from "./src/config/index.js";

import {router as userRouter} from "./src/routers/user.route.js"
import {router as restaurantRouter} from "./src/routers/restaurant.route.js"
import {router as categoryRouter} from "./src/routers/category.route.js"
import {router as itemRouter} from "./src/routers/item.route.js"

const app = express()

mongoose.connect(config.mongodb_connection_url).then(()=> console.log("Database connection established")).catch(e=> console.log("Mongo connection error: ", e.message))

const port = config.port || 4000;

app.use(morgan('tiny'))
app.use(express.json())

app.use('/api/v1/user', userRouter)
app.use('/api/v1/restaurant', restaurantRouter)
app.use('/api/v1/category', categoryRouter)
app.use('/api/v1/item', itemRouter)

app.use(globalErrorHandler)


app.listen(port, ()=>{
  console.log(`Server runnning on port: ${port}`)
})