import User from "../model/user.model.js"
import { userSignUpValidator, userLoginValidator, userUpdateValidator, passwordResetValidator, forgotPasswordValidator, otpValidator} from "../validators/user.validator.js"
import { mongoIdValidator } from "../validators/mongoId.validator.js"
import { BadUserRequestError, NotFoundError } from "../error/error.js"
import {generateToken} from "../utils/jwt.js"
// import { otpAuthMiddleWare} from "../middleware/auth.js"
import bcrypt from "bcrypt"
import crypto from "crypto"
import Token from "../model/token.model.js"
import nodemailer from 'nodemailer'
import smtpTransport from 'nodemailer-smtp-transport';
import Otp from "../model/otp.model.js"
import sendEmail from "../utils/mail.handler.js"
import {generateOtp, verifyOtp} from "../utils/otp.handler.js"
import {config} from "../config/index.js"
import { token } from "morgan"


export default class UserController {

// Assuming the necessary imports and configurations are already done

static async userSignUp(req, res) {
  const { error, value } = userSignUpValidator.validate(req.body);
  console.log(error);
  
  if (error) {
    return res.status(400).json({ status: "failed", message: error.details[0].message });
  }
  
  const usernameExists = await User.findOne({ userName: req.body.userName });
  console.log(usernameExists, "This is what I'm logging");
  
  if (usernameExists) {
    throw new BadUserRequestError("An account with this username already exists.");
  }
  
  const emailExists = await User.findOne({ email: req.body.email });
  
  if (emailExists) {
    throw new BadUserRequestError("An account with this email already exists.");
  }
  
  const saltRounds = config.bycrypt_salt_round
  const hashedPassword = bcrypt.hashSync(req.body.password, saltRounds);
  const user = {
    userName: req.body.userName,
    email: req.body.email,
    password: hashedPassword,
    userAddress: req.body.userAddress,
  }


  const newUser = await User.create(user);
  
  let otp = await Otp.findOne({ userId: newUser._id });
  
  if (!otp) {
    const token = generateOtp();
    await sendEmail(user.email, "Mealy Account", `This is your account TOKEN: \n\n${token}\n\n Please enter the TOKEN to complete your account creation.`);
    otp = await new Otp({
      userId: newUser._id,
      otp: token,
    }).save();
  }
 
  
  res.status(200).json({
    message: "User created successfully",
    status: "Success",
    data: {
      user: newUser,
      access_token: generateToken(newUser),
      verified: false,
    },
  });
}



static async otpVerification(req, res) {
  const { error } = otpValidator.validate(req.body);

  if (error) {
    throw new BadUserRequestError("Please pass in a valid Token.");
  }

  const userOtp = req.body.otp;
  // const user = req.user; // Assuming the user is available in the request object

  const otp = await Otp.findOne({ otp: userOtp });

  if (!otp) {
    throw new NotFoundError("Please enter a valid TOKEN.");
  }

  await Otp.deleteOne({  otp: userOtp }, { isDeleted: true });
  
  // await sendEmail(user.email, "Mealy Account", "Your account has been created successfully");
  return res.status(200).json({
    message: "User created successfully.",
    status: "Success",
  });
}

  
  static async userLogin(req, res) {
  
    const { error } = userLoginValidator.validate(req.body);
    if (error) throw error;
    if (!req.body.email || !req.body.password) {
      throw new BadUserRequestError("Please provide a valid email or password.");
    }
    const user = await User.findOne({
      $or: [
        {
          email: req.body.email,
        },
        {
          password: req.body.password,
        },
      ],
    });
    if (!user) throw new BadUserRequestError("Password, email does not exist");
    const hash = bcrypt.compareSync(req.body.password, user.password);
    if (!hash) throw new BadUserRequestError("User email or password is incorrect!");
    res.status(200).json({
      message: "User found successfully",
      status: "Success",
      data: {
        user,
        access_token: generateToken(user),
      },
    });
  }
 

  static async userUpdate(req, res){
    const { id } = req.params
    const userUpdateValidatorResponse = await userUpdateValidator.validate(req.body)
    const userUpdateError = userUpdateValidatorResponse.error
    if(userUpdateError) throw userUpdateError

    const user = await User.findById(id)
    if(!user) throw new NotFoundError(`The user with this id: ${id}, does not exist`)

    const updatedUser = await User.findByIdAndUpdate(id, req.body, {new: true})
    return res.status(200).json({
      message: "User updated successfully",
      status: "Success",
      data:{
        user: updatedUser
      }
    })
  }

  
  static async forgotPassword(req, res) {
    try {
        const { error } = forgotPasswordValidator.validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const user = await User.findOne({ email: req.body.email });
        if (!user)
            return res.status(400).send("User with the given email doesn't exist");

        let token = await Token.findOne({ userId: user._id });
        if (!token) {
            token = await new Token({
                userId: user._id,
                token: crypto.randomBytes(32).toString("hex"),
            }).save();
        }

        const link = `${process.env.BASE_URL}/password-reset/${user._id}/${token.token}`;
        await sendEmail(user.email, "Password reset", link);

        res.send("Password reset link sent to your email account");
    } catch (error) {
        res.send("An error occurred");
        console.log(error);
    }
}


static async resetUserPassword(req, res) {
  try {
    const { error } = passwordResetValidator.validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

      const user = await User.findById(req.params.userId);
      if (!user) return res.status(400).send("Invalid link or expired");

      const token = await Token.findOne({
          userId: user._id,
          token: req.params.token,
      });
      if (!token) return res.status(400).send("Invalid link or expired");

      user.password = req.body.password;
      await user.save();
      await token.deleteOne();

      res.send("Password reset is successful.");
  } catch (error) {
      res.send("An error occurred");
      console.log(error);
  }
}


  static async logOut(req, res) {
    const { tokenId } = req.body;

    try {
      await Token.deleteOne({ _id: tokenId });

      res.status(200).json({
        message: "Token deleted successfully",
        status: "Success"
      });
    } catch (error) {
      console.error('Error deleting token:', error);
      res.status(500).json({
        message: "Failed to delete token",
        status: "Error"
      });
    }
  }




static async findUser(req, res,) {
  const { id } = req.params
  const { error } = mongoIdValidator.validate(req.params)
  if (error) throw new BadUserRequestError("Please pass in a valid mongoId")
  const user = await User.findById(id)
  if (!user) throw new NotFoundError('User not found')

  res.status(200).json({
    message: "User found successfully",
    status: "Success",
    data: {
      user
    }
  })
}

}