import { Router } from "express";
import { fileuploadcloud } from "../../utils/multer/multer.cloud.js";
import { isValid }from "../../middleware/validition.middleware.js";
import { sendMessageSchema,getMessagesSchema } from "./message.validition.js";
import { asyncHandler } from "../../utils/error/index.js";
import * as message  from "./message.servies.js";

import { isAuth } from "../../middleware/auth.validition.js";
const router=Router();
router.post("/:receiver",fileuploadcloud().array("attachments",10),
isValid(sendMessageSchema),asyncHandler(message.sendMessage));
router.post("/:receiver/sender",isAuth,fileuploadcloud().array("attachments",10),
isValid(sendMessageSchema),asyncHandler(message.sendMessage));
router.get("/:id",isAuth,isValid(getMessagesSchema),asyncHandler(message.getMessages));

export default router;



