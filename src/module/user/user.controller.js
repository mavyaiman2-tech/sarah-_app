import { Router } from "express";
import * as user from"./user.servies.js";
import { fileupload } from "../../utils/multer/multer.local.js";
import {fileuploadcloud} from "../../utils/multer/multer.cloud.js";
import { fileValidationMiddleware } from "../../middleware/file.validition.js";
import { isAuth } from "../../middleware/auth.validition.js";
import { asyncHandler } from "../../utils/error/index.js";

const router=Router();

router.patch("/updatePassword",isAuth,asyncHandler(user.updatePassword));

router.post("/uploadprofile",isAuth,fileupload().single("profile"),
fileValidationMiddleware
,asyncHandler(user.uploadprofilelocal));

router.post("/uploadprofilecloud",isAuth,fileuploadcloud().single("profile"),
fileValidationMiddleware,
asyncHandler(user.uploadprofilecloud));

router.delete("/deleteAccount",isAuth,asyncHandler(user.deleteAccount));
router.get("/",isAuth,user.getprofile);
export default router;

