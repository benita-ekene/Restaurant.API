import User from "../model/user.model.js"
import { userSignUpValidator, userLoginValidator, userUpdateValidator, passwordResetValidator } from "../validators/user.validator.js"
import { mongoIdValidator } from "../validators/mongoId.validator.js"
import { BadUserRequestError, NotFoundError } from "../error/error.js"
import {generateToken} from "../utils/jwt.js"
import bcrypt from "bcrypt"
import crypto from "crypto"
import Token from "../model/token.model.js"
import nodemailer from 'nodemailer'
import smtpTransport from 'nodemailer-smtp-transport';
import sendEmail from "../utils/mail.handler.js"
import {config} from "../config/index.js"


export default class UserController {

  static async userSignUp(req, res) {
    const { error, value } = userSignUpValidator.validate(req.body)
    if (error) throw error
    const emailExists = await User.find({ email: req.body.email })
    if (emailExists.length > 0) throw new BadUserRequestError("An account with this email already exists.")
    const usernameExists = await User.find({ userName: req.body.userName })
    if (usernameExists.length > 0) throw new BadUserRequestError("An account with this username already exists.")
    const saltRounds = config.bycrypt_salt_round
    const hashedPassword = bcrypt.hashSync(req.body.password, saltRounds);
    const user = {
      userName: req.body.userName,
      email: req.body.email,
      password: hashedPassword,
      userAddress: req.body.userAddress,
    }
    
    const newUser = await User.create(user)
    await sendEmail(user.email, "Mealy Account", "Your account has been successfully created.")
    res.status(200).json({
      message: "User created successfully",
      status: "Success",
      data: {
        user: newUser,
        access_token: generateToken(newUser)
      }
    })
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
    const { id } = req.query
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
        const { error } = passwordResetValidator.validate(req.body);
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
      await token.delete();

      res.send("Password reset is successful.");
  } catch (error) {
      res.send("An error occurred");
      console.log(error);
  }
}

  
  
static async logoutUser(req, res) {
  try {
    res.clearCookie('jwt');
    res.status(200).json({
      message: "Logout successful",
      status: "Success"
    });
  } catch (error) {
    res.status(500).json({
      message: "Error occurred during logout",
      status: "Error"
    });
  }
};


static async findUser(req, res,) {
  const { id } = req.query
  const { error } = mongoIdValidator.validate(req.query)
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
