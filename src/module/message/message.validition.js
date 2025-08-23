import Joi from "joi";
import { generalFeilds } from "../../middleware/validition.middleware.js";
export const sendMessageSchema=Joi.object({
    receiver:generalFeilds.objectId.required(),
    content:Joi.string().min(3).max(1000),
   sender:generalFeilds.objectId,
}).required();
export const getMessagesSchema=Joi.object({
    id:generalFeilds.objectId.required(),
}).required();
