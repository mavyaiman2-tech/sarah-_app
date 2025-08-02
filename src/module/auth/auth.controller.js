import { Router } from "express";
import * as auth from "./auth.servies.js";
const router=Router();
router.post("/register",auth.register);
router.post("/login",auth.login);
router.post("/verifyOtp",auth.verifyOtp);
router.post("/resendOtp",auth.resendOtp);
router.post("/refresh",auth.refresh);
export default router;


 