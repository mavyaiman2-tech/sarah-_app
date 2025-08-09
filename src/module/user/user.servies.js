<<<<<<< HEAD
import User from "../../model/user.model.js";
import bcrypt from "bcrypt";
import { verifyAccessToken } from "../../utils/token/index.js";

export const updatePassword = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      throw new Error("Access token is required", { cause: 401 });
    }

    const decoded = verifyAccessToken(token); 
    const userId = decoded.id;

    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      throw new Error("Both old and new passwords are required", { cause: 400 });
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found", { cause: 404 });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      throw new Error("Old password is incorrect", { cause: 400 });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    return res.status(err.cause || 500).json({ message: err.message });
  }
};
=======
import User from "../../model/user.model.js";
import bcrypt from "bcrypt";
import { verifyRefreshToken } from "../../utils/token/index.js";
  import { fileupload } from "../../utils/multer/index.js";
  import { fileValidationMiddleware } from "../../middleware/file.validition.js";
import fs from "fs";
  export const updatePassword = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      throw new Error("Access token is required", { cause: 401 });
    }

    const decoded = verifyRefreshToken(token); 
    const userId = decoded.id;

    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      throw new Error("Both old and new passwords are required", { cause: 400 });
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found", { cause: 404 });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      throw new Error("Old password is incorrect", { cause: 400 });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    return res.status(err.cause || 500).json({ message: err.message });
  }
};

export const uploadprofilecover = async(req,res,next)=>{
  if(req.user.profile){
    fs.unlinkSync(req.user.profile);
  }
const id=req.user._id;
const userExist=await User.findByIdAndUpdate(id,
  {profile:req.file.path},{new:true});
if(!userExist){
    throw new Error("User not found",{cause:404});
}
return res.status(200).json({message:"Profile updated successfully",
  success:true,data:userExist});

}
    
>>>>>>> master
