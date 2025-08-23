import User from "../../model/user.model.js";
import {Token} from "../../model/token.model.js";
import bcrypt from "bcrypt";
import {verifyAccessToken } from "../../utils/token/index.js";
import fs from "fs";
import cloudinary from "../../utils/cloud/index.js";
import{comparePassword,hashPassword} from "../../utils/hash/index.js";

export const updatePassword = async (req, res, next) => {
  
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

    const isMatch = await comparePassword(oldPassword, user.password);
    if (!isMatch) {
      throw new Error("Old password is incorrect", { cause: 400 });
    }

    user.password = await hashPassword(newPassword);
    await user.save();

    return res.status(200).json({ message: "Password updated successfully",success:true });
}
export const uploadprofilelocal = async(req,res,next)=>{
  if(req.user.profile && req.user.profile.public_id){
    fs.unlinkSync(req.user.profile.public_id);
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
export const uploadprofilecloud = async (req, res, next) => {
  const user = req.user;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  
  if (user.profile && user.profile.public_id) {
    await cloudinary.uploader.destroy(user.profile.public_id);
  }

 
  const { secure_url, public_id } =
   await cloudinary.uploader.upload(req.file.path,{
folder:`sarah_app/users/${user._id}/profile`,
public_id: user.profile.public_id,

   });

  
  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    { profile: { secure_url, public_id } },
    { new: true }
  );

  return res.status(200).json({
    message: "Profile updated successfully",
    success: true,
    data: { secure_url, public_id },
  });
} ;
export const deleteAccount = async (req, res, next) => {
 
    
    await User.updateOne(
      { _id: req.user._id },
      {
        deletedAt: Date.now(),
        credentialsUpdateAt: Date.now()
      }
    );

   
    await Token.deleteMany({ user: req.user._id });

    return res.status(200).json({
      message: "Account deleted successfully",
      success: true
    }) };

    export const getprofile=async(req,res,next)=>{
      const user=await User.findOne({_id:req.user._id},{},{
          populate:[{path:"messages",
            populate:{path:"receiver",select:"-password -deletedAt -credentialsUpdateAt -__v"}}]
      });
          return res.status(200).json
          ({message:"Profile fetched successfully",success:true,data:user})
      };