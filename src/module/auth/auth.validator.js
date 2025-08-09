import Joi from "joi";

const registerSchema = Joi.object({
    fullName: Joi.string().required(),
    email: Joi.string().email().required()
        .when("phoneNumber", {
            is: Joi.exist(),
            then: Joi.optional(),
            otherwise: Joi.required()
        }),

    password: Joi.string()
        .pattern(new RegExp("^[\\S]{8,}$"))
        .required()
        .messages({
            "string.pattern.base": `"password" must be at least 8 characters and not contain spaces.`,
        }),
    phoneNumber: Joi.string().required(),
    dob: Joi.date().required(),
});
const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});
const verifyOtpSchema = Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.number().required(),
});
const resendOtpSchema = Joi.object({
    email: Joi.string().email().required(),
});
const refreshSchema = Joi.object({
    token: Joi.string().required(),
});
const loginWithGoogleSchema = Joi.object({
    idToken: Joi.string().required(),
});
export { registerSchema, loginSchema, verifyOtpSchema, resendOtpSchema, refreshSchema, loginWithGoogleSchema };

