

//  export const isValid = (schema) => {
//     return (req, res, next) => {

//         const schema = Joi.object({
//             fullName: Joi.string().required(),
//             email: Joi.string().email().required()
//                 .when("phoneNumber", {
//                     is: Joi.exist(),
//                     then: Joi.optional(),
//                     otherwise: Joi.required()
//                 }),

//             password: Joi.string()
//                 .pattern(new RegExp("^[\\S]{8,}$"))
//                 .required()
//                 .messages({
//                     "string.pattern.base": `"password" must be at least 8 characters and not contain spaces.`,
//                 }),
//             phoneNumber: Joi.string().required(),
//             dob: Joi.date().required(),
//         });
//         const { error, value } = schema.validate(req.body, { abortEarly: false });
//         if (error) {
//             const errorMessage = error.details.map(detail => detail.message).join(", ");
//             throw new Error(errorMessage, { cause: 400 });
//         }

//     }
// };
export const isValid = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            const errorMessage = error.details.map(detail => detail.message).join(", ");
            return next(new Error(errorMessage, { cause: 400 }));
        }
        next();
    };
};
