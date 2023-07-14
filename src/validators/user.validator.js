import Joi from 'joi'

export const userSignUpValidator = Joi.object({
  userName: Joi.string().required(),
  email: Joi.string().regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
  .required()
  .messages({
    'string.pattern.base': 'Email is not a valid email format/address',
  }),
  password: Joi.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/)
  .required()
  .messages({
    'string.pattern.base': 'You need one number, one alphanumeric character and one in caps, password be more than 7 characters long',
  }),
  userAddress: Joi.string().required(),
  
}).strict()


export const userLoginValidator = Joi.object({
  userName:Joi.string().optional(),
  email:Joi.string().optional(),
  password: Joi.string().required()
}).strict()

export const userUpdateValidator = Joi.object({
  userName: Joi.string().optional(),
  userAddress: Joi.string().optional(),
  email: Joi.string().regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
  .optional()
  .messages({
    'string.pattern.base': 'Email not found',
  }),
  password: Joi.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/)
  .optional()
  .messages({
    'string.pattern.base': 'Password not found',
  }) 
}).strict()

export const forgotPasswordValidator = Joi.object({
  email:Joi.string().required(),
}).strict()

export const passwordResetValidator = Joi.object({
  email:Joi.string().required(),
  password: Joi.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/)
  .required()
}).strict()


export const otpValidator = Joi.object({
  otp:Joi.string().required(),
}).strict()