import { Router } from "express";
import * as user from "./user.servies.js";
const router=Router();
router.patch("/updatePassword",user.updatePassword);
export default router;


