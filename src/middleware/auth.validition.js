import User from "../model/user.model.js";
import {verifyRefreshToken} from "../utils/token/index.js"    
export const isAuth=async(req,res,next)=>{

const token=req.headers.authorization;
if(!token){
    throw new Error("Access token is required",{cause:401});
}
const payload=verifyRefreshToken(token);
const userId=payload.id;
const userExist=await User.findById(userId);
if(!userExist){
    throw new Error("User not found",{cause:404});
}
req.user=userExist;
 return next();
}
    
