import { generateRefreshToken, generateToken, verifyRefreshToken } from "../token/index.js";  
import {Token} from "../../model/token.model.js";  
export const asyncHandler = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch((err) => next(err))

    };

};
export const globalErrorHandler=async(err,req,res,next)=>{
    if (err.message === "jwt expired") {
        const refreshToken = req.headers["refreshtoken"];
        if (!refreshToken) {
            throw new Error("Refresh token is required", { cause: 401 });
        }
        const payload=verifyRefreshToken(refreshToken);
       const tokenExist= await Token.findOneAndDelete({token:refreshToken,type:"refresh"})
        if(!tokenExist){
            throw new Error("Refresh token is invalid", { cause: 401 });
        }
     const accessToken = generateToken({ id: payload.id });
     const NewrefreshToken = generateRefreshToken({ id: payload.id });
   await Token.create
   ({token:NewrefreshToken,userId:payload.id,type:"refresh"});
   return res.status(200).json({
       message: "User refreshed successfully",
       data: { accessToken, NewrefreshToken }
   });  
}
res.status(err.cause || 500).json({
    message: err.message || "Internal Server Error",

}   );}
    