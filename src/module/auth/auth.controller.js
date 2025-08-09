<<<<<<< HEAD
import { Router } from "express";
import * as auth from "./auth.servies.js";
const router=Router();
router.post("/register",auth.register);
router.post("/login",auth.login);
router.post("/verifyOtp",auth.verifyOtp);
router.post("/resendOtp",auth.resendOtp);
router.post("/refresh",auth.refresh);
export default router;


=======
import { Router } from "express";
import * as auth from "./auth.servies.js";
import { asyncHandler } from "../../utils/error/index.js";
import { isValid } from "../../middleware/validition.middleware.js";
import { registerSchema,loginSchema,verifyOtpSchema,resendOtpSchema,refreshSchema,loginWithGoogleSchema } from "./auth.validator.js";
const router=Router();

router.post("/register", isValid(registerSchema), asyncHandler(auth.register));
router.post("/login",isValid(loginSchema),asyncHandler(auth.login));
router.post("/verifyOtp", isValid(verifyOtpSchema), asyncHandler(auth.verifyOtp));
router.post("/resendOtp", isValid(resendOtpSchema), asyncHandler(auth.resendOtp));
router.post("/refresh", isValid(refreshSchema), asyncHandler(auth.refresh));
router.post("/loginWithGoogle", isValid(loginWithGoogleSchema), asyncHandler(auth.loginWithGoogle));
export default router;


>>>>>>> master
 