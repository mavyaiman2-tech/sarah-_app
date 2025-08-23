import { Router } from "express";
import * as auth from "./auth.servies.js";
import{fileupload} from "../../utils/multer/multer.local.js";
import{fileValidationMiddleware} from "../../middleware/file.validition.js";
import { asyncHandler } from "../../utils/error/index.js";
import { isValid } from "../../middleware/validition.middleware.js";
import { registerSchema,loginSchema,sendOtpSchema,verifyOtpSchema,resendOtpSchema,refreshSchema,loginWithGoogleSchema } from "./auth.validator.js";
import { isAuth } from "../../middleware/auth.validition.js";
const router=Router();



router.post("/register", isValid(registerSchema),

asyncHandler(auth.register));
router.post("/login",isValid(loginSchema),asyncHandler(auth.login));
router.post("/verifyOtp", isValid(verifyOtpSchema), asyncHandler(auth.verifyOtp));
router.post("/sendOtp", isValid(sendOtpSchema), asyncHandler(auth.sendOtp));
router.post("/refresh", isValid(refreshSchema), asyncHandler(auth.refresh));
router.post("/loginWithGoogle", isValid(loginWithGoogleSchema), asyncHandler(auth.loginWithGoogle));
router.post("/updatePassword",isAuth,asyncHandler(auth.updatePassword));
router.patch("/resetPassword",isAuth,isValid(resendOtpSchema),asyncHandler(auth.resetPassword));  
router.post("/logout",isAuth,asyncHandler(auth.logout));
    





export default router;




 