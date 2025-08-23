import User from "../model/user.model.js";
import { verifyAccessToken } from "../utils/token/index.js"
    import { Token }from "../model/token.model.js";    
export const isAuth = async (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        throw new Error("Access token is required", { cause: 401 });
    }
    const payload = verifyAccessToken(token);

    const blackListToken=await Token.findOne({token,type:"access"})
    if(blackListToken){
        throw new Error("Access token is invalid", { cause: 401 });
    }
    const userId = payload.id;
    const userExist = await User.findById(userId);
    if (!userExist) {
        throw new Error("User not found", { cause: 404 });
    }
    if (userExist.credentialsUpdateAt > new Date(payload.iat * 1000)) {
        throw new Error("Token is invalid", { cause: 401 });
      }   
    req.user = userExist;
    return next();}

