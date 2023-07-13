import mongoose from "mongoose";
import {Schema, model} from "mongoose";
// import speakeasy from 'speakeasy';
// import {generateOtp, verifyOtp} from "../utils/otp.handler.js"

const otpSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "user",
    },
    otp: {
        type: String,
        required: true,
        min: 4,
        max: 4
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 3600,
    },
});

export default model("Otp", otpSchema);