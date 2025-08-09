<<<<<<< HEAD
import { Router } from "express";
import * as user from "./user.servies.js";
const router=Router();
router.patch("/updatePassword",user.updatePassword);
export default router;


=======
import { Router } from "express";
import * as user from "./user.servies.js";
import { fileupload } from "../../utils/multer/index.js";
import { fileValidationMiddleware } from "../../middleware/file.validition.js";
import { isAuth } from "../../middleware/auth.validition.js";
const router=Router();
router.patch("/updatePassword",user.updatePassword);
router.post("/uploadprofile",isAuth,fileupload().single("profile"),
fileValidationMiddleware
,user.uploadprofilecover);
export default router;


>>>>>>> master
