import User from "../../model/user.model.js";
import { sendEmail } from "../../utils/email/index.js";
import { generateOtp } from "../../utils/otp/index.js";
import { generateToken, generateRefreshToken, verifyRefreshToken } from "../../utils/token/index.js";
import { OAuth2Client } from "google-auth-library"
import { hashPassword, comparePassword } from "../../utils/hash/index.js";
import { Token}  from "../../model/token.model.js";
import jwt from "jsonwebtoken";
export const register = async (req, res, next) => {


    const { fullName, email, password, phoneNumber, dob } = req.body;


    const userExist = await User.findOne({
        $or: [{ $and: [{ email: { $ne: null } }, { email: { $exists: true } }, { email: email }] },
        { $and: [{ phoneNumber: { $ne: null } }, { phoneNumber: { $exists: true } }, { phoneNumber: phoneNumber }] }]
    })
    if (userExist) {
        throw new Error("User already exists", { cause: 400 });
    }
    const hashedPassword = await hashPassword(password);
    const user = new User({
        fullName,
        email,
        password: hashedPassword,
        phoneNumber,
        dob
    })
    const { otp, otpExpire } = generateOtp();
    user.otp = otp;
    user.otpExpiry = otpExpire;

    await sendEmail({
        to: email,
        subject: "verification email",
        html: `<p>click on the link to verify your email ${otp}</p>`
    })
    const createdUser = await user.save();

    // resolve -reject
    return res.status(201).json({ message: "User created successfully", createdUser });



}

export const login = async (req, res, next) => {


    const { email, password, phoneNumber } = req.body;
    const userExist = await User.findOne({
        $or: [{ $and: [{ email: { $ne: null } }, { email: { $exists: true } }, { email: email }] },
        { $and: [{ phoneNumber: { $ne: null } }, { phoneNumber: { $exists: true } }, { phoneNumber: phoneNumber }] }]
    })
    if (!userExist) {
        throw new Error("User not found", { cause: 404 });
    }
    

    const isPasswordMatched = await comparePassword(password, userExist.password);
    if (!isPasswordMatched) {
        throw new Error("Invalid credentials", { cause: 401 });

    }
if(userExist.deletedAt){
    userExist.deletedAt=undefined;
    await userExist.save();
}

    const accessToken = generateToken({ id: userExist._id });
    const refreshToken = generateRefreshToken({ id: userExist._id });
    

    await Token.create({
        token: refreshToken,
        user: userExist._id,
        type: "refresh"
    });


    await userExist.save();
    return res.status(200).json({ message: "User logged in successfully", data: { accessToken, refreshToken } });
}
export const verifyOtp = async (req, res, next) => {
    
      const { email, otp } = req.body;
  
     
      if (!email || !otp) {
        return res.status(400).json({ message: "Email and OTP are required" });
      }
  
      
      const userExist = await User.findOne({
        email,
        otp,
        otpExpiry: { $gt: Date.now() }
      });
  
      if (!userExist) {
        return res.status(404).json({ message: "Invalid or expired OTP" });
      }
  
    
      userExist.isVerified = true;
      userExist.otp = undefined;
      userExist.otpExpiry = undefined;
  
      
      const accessToken = generateToken({ id: userExist._id });
      const refreshToken = generateRefreshToken({ id: userExist._id });
  
      userExist.refreshToken = refreshToken;
      await userExist.save();
  
      
      return res.status(200).json({
        message: "User verified successfully",
        data: { accessToken, refreshToken }
      });
  
    
  };
  
export const sendOtp = async (req, res, next) => {

    const { email } = req.body;
    const userExist = await User.findOne({ email });
    if (!userExist) {
        throw new Error("User not found", { cause: 404 });
    }
    const { otp, otpExpire } = generateOtp();
    const updatedUser = await User.findOneAndUpdate({ email }, { otp, otpExpiry: otpExpire });
    if (!updatedUser) {
        throw new Error("User not found", { cause: 404 });
    }
    await sendEmail({
        to: email,
        subject: "send otp",
        html: `<p>click on the link to verify your email ${otp}</p>`
    })
    return res.status(200).json({ message: "Otp sent successfully" });
}
export const loginWithGoogle = async (req, res, next) => {

    const { idToken } = req.body;
    const client = new OAuth2Client("765078419907-ha5l8n6d8ummvhil264al42fbvfffnsp.apps.googleusercontent.com")

    const ticket = await client.verifyIdToken({
        idToken
    })

    const payload = ticket.getPayload();
    const userExist = await User.findOne({ email: payload.email });
    if (!userExist) {
        throw new Error("User not found", { cause: 404 });
    }
    const createdUser = await User.create({
        fullName: payload.name,
        email: payload.email,
        phoneNumber: payload.phone_number,
        dob: payload.birthday,
        isVerified: true,
        userAgent: "google"

    })

    const accessToken = generateToken({ id: userExist._id });
    const refreshToken = generateRefreshToken({ id: userExist._id });
    userExist.refreshToken = refreshToken;
    await userExist.save();

    return res.status(200).json({ message: "User logged in successfully", data: { accessToken, refreshToken } });
}


// export const refresh = async (req, res, next) => {
//     const { Token } = req.body;
//     if (!Token) {
//         throw new Error("Refresh token is required", { cause: 401 });
//     }

//     const decoded = verifyRefreshToken(Token);
//     const userId = decoded.id;
//     const userExist = await User.findById(userId);

//     if (!userExist) {
//         throw new Error("User not found", { cause: 404 });
//     }

//     if (userExist.refreshToken !== Token) {
//         throw new Error("Invalid refresh token", { cause: 401 });
//     }

//     const accessToken = generateToken({ id: userExist._id });
//     const refreshToken = generateRefreshToken({ id: userExist._id });
//     userExist.refreshToken = refreshToken;
//     await userExist.save();

//     return res.status(200).json({
//         message: "User refreshed successfully",
//         data: { accessToken, refreshToken }
//     });
// };
export const resetPassword = async (req, res, next) => {
    const { email, otp, newPassword, rePassword } = req.body;

    const userExist = await User.findOne({ email });
    if (!userExist) {
        throw new Error("User not found", { cause: 404 });
    }

    if (userExist.otp !== otp) {
        throw new Error("Invalid otp", { cause: 401 });
    }

    if (userExist.otpExpiry < Date.now()) {
        throw new Error("Otp expired", { cause: 401 });
    }

    if (newPassword !== rePassword) {
        throw new Error("Passwords do not match", { cause: 400 });
    }

    userExist.password = await hashPassword(newPassword);
    userExist.credentialsUpdateAt = Date.now(); 
    userExist.otp = undefined;
    userExist.otpExpiry = undefined;
   
    await userExist.save();
await Token.deleteMany({ user: userExist._id,type:"refresh" });
    return res.status(200).json({ message: "Password reset successfully", success: true });
};


export const logout = async (req, res, next) => {
    const token = req.headers.token || req.headers.authorization;
    if (!token) { throw new Error("Access token is required", { cause: 401 }); }
    ;
     await Token.create({ token, type: "access", user: req.user._id });
     return res.status(200).json({ message: "User logged out successfully" });  
   }