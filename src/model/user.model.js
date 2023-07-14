import joi from "joi";
import {Schema, model} from "mongoose";

const UserSchema = new Schema({
  userName: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
    min: 3,
    max: 255
  },
 
  email: {
    type: String,
    required: true,
    validators: {
      match: [/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/, "Please add a valid email string to the email path."]
    }
  },
  password: {
    type: String,
    required: true
  },
  userAddress: {
    type: String,
    }
},
{
  timestamps: true
})


export default model ("User", UserSchema)