import Joi from "joi";
import { generalFeilds } from "../../middleware/validition.middleware.js";

    export const registerSchema = Joi.object({
    fullName: Joi.string().required(),

    email: Joi.string().email(),

    phoneNumber: Joi.string()
        .pattern(/^[0-9]{10,15}$/)
        .messages({
            "string.pattern.base": `"phoneNumber" must be a valid phone number.`,
        }),

    password: Joi.string()
        .pattern(new RegExp("^[\\S]{8,}$"))
        .required()
        .messages({
            "string.pattern.base": `"password" must be at least 8 characters and not contain spaces.`,
        }).required(),

    dob: Joi.date().required(),
}).or("email", "phoneNumber").required();

export  const loginSchema = Joi.object({
    email:generalFeilds.email.required(),
    password:generalFeilds.password.required(),
}).required();
export const verifyOtpSchema = Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.number().required(),
}).required();
export const sendOtpSchema = Joi.object({
    email: Joi.string().email().required(),
}).required();
export const refreshSchema = Joi.object({
    token: Joi.string().required(),
}).required();
export const loginWithGoogleSchema = Joi.object({
    idToken: Joi.string().required(),
}).required();
export const resendOtpSchema = Joi.object({
  email:generalFeilds.email.required(),
  newPassword:generalFeilds.password.required(),
  otp:generalFeilds.otp.required(),
  rePassword:generalFeilds.rePassword.required(),
    }).required();
