<<<<<<< HEAD
import User from "../../model/user.model.js";
import bcrypt from "bcrypt";
import { sendEmail } from "../../utils/email/index.js";
import { generateOtp } from "../../utils/otp/index.js";
import { generateAccessToken,generateRefreshToken,verifyRefreshToken} from "../../utils/token/index.js";
export const register = async (req, res,next) => {
    try {
        const { fullName, email, password, phoneNumber, dob } = req.body;
        const userExist = await User.findOne({
            $or: [{ $and: [{ email: { $ne: null } }, { email: { $exists: true } }, { email: email }] },
            { $and: [{ phoneNumber: { $ne: null } }, { phoneNumber: { $exists: true } }, { phoneNumber: phoneNumber }] }]
        })
        if (userExist) {
            throw new Error("User already exists", { cause: 400 });
        }
        const hashedPassword = await bcrypt.hash(password, 4);
        const user = new User({
            fullName,
            email,
            password: hashedPassword,
            phoneNumber,
            dob
        })
      const {otp,otpExpire}=generateOtp();
user.otp=otp;
user.otpExpiry=otpExpire;

         await sendEmail({to:email,
             subject:"verification email",
            html:`<p>click on the link to verify your email ${otp}</p>`})
            const createdUser = await user.save();

            // resolve -reject
        return res.status(201).json({ message: "User created successfully", createdUser });
    } catch (err) {
        return res.status(err.cause || 500).json({ message: err.message })
    }
    
}
export const login = async (req, res, next) => {

    try {
const {email,password,phoneNumber}=req.body;
const userExist=await User.findOne({
    $or: [{ $and: [{ email: { $ne: null } }, { email: { $exists: true } }, { email: email }] },
    { $and: [{ phoneNumber: { $ne: null } }, { phoneNumber: { $exists: true } }, { phoneNumber: phoneNumber }] }]
})
if(!userExist){
    throw new Error("User not found",{cause:404});
}
const isPasswordMatched=await bcrypt.compare(password,userExist.password);
if(!isPasswordMatched){
    throw new Error("Invalid credentials",{cause:401});
}
const accessToken=generateAccessToken({id:userExist._id});
const refreshToken=generateRefreshToken({id:userExist._id});
userExist.refreshToken = refreshToken;
await userExist.save();
return res.status(200).json({message:"User logged in successfully",userExist,accessToken,refreshToken});


    }
    catch (error) {
        return res.status(error.cause || 500).json({ message: error.message })
    }
}
export const verifyOtp=async(req,res,next)=>{
    try {
        const {email,otp}=req.body;
        const userExist=await User.findOne({email
            ,otp,
            otpExpiry:{$gt:Date.now()}
        });

        if(!userExist){
            throw new Error("User not found",{cause:404});
        }

       
        userExist.isVerified=true;
        userExist.otp=undefined;
        userExist.otpExpiry=undefined;
        const payload = { id: userExist._id };
       const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);
        userExist.refreshToken = refreshToken;
       
        await userExist.save();
        return res.status(200).json({message:"User verified successfully",userExist,accessToken,refreshToken});
    } catch (error) {
        return res.status(error.cause || 500).json({ message: error.message })
    }
}
export const resendOtp=async(req,res,next)=>{
    try {
        const {email}=req.body;
        const userExist=await User.findOne({email});
        if(!userExist){
            throw new Error("User not found",{cause:404});
        }
        const {otp,otpExpire}=generateOtp();
        await User.updateOne({email},{otp,otpExpiry:otpExpire});
        await sendEmail({to:email,
            subject:"re_send otp",
           html:`<p>click on the link to verify your email ${otp}</p>`})
        return res.status(200).json({message:"Otp sent successfully",userExist});
    } catch (error) {
        return res.status(error.cause || 500).json({ message: error.message })
    }
}
export const refresh =async(req,res,next)=>{
    try{
const {Token}=req.body;
if (!Token){
    throw new Error("Refresh token is required",{cause:401});
}
const decoded=verifyRefreshToken(Token);
const userId=decoded.id;        
const userExist=await User.findById(userId);
if (!userExist){
    throw new Error("User not found",{cause:404});
}
const accessToken=generateAccessToken({id:userExist._id});
const refreshToken=generateRefreshToken({id:userExist._id});
userExist.refreshToken = refreshToken;
await userExist.save();
return res.status(200).json({message:"User logged in successfully",userExist,accessToken,refreshToken});



    }catch (err){

return res.status(err.cause || 500).json({message:err.message})
    }
}
=======
import User from "../../model/user.model.js";
import bcrypt from "bcrypt";
import { sendEmail } from "../../utils/email/index.js";
import { generateOtp } from "../../utils/otp/index.js";
import { generateToken, generateRefreshToken, verifyRefreshToken } from "../../utils/token/index.js";
import { OAuth2Client } from "google-auth-library"

export const register = async (req, res, next) => {


    const { fullName, email, password, phoneNumber, dob } = req.body;
   

    const userExist = await User.findOne({
        $or: [{ $and: [{ email: { $ne: null } }, { email: { $exists: true } }, { email: email }] },
        { $and: [{ phoneNumber: { $ne: null } }, { phoneNumber: { $exists: true } }, { phoneNumber: phoneNumber }] }]
    })
    if (userExist) {
        throw new Error("User already exists", { cause: 400 });
    }
    const hashedPassword = await bcrypt.hash(password, 4);
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
    const isPasswordMatched = await bcrypt.compare(password, userExist.password);
    if (!isPasswordMatched) {
        throw new Error("Invalid credentials", { cause: 401 });

    }
    const accessToken = generateToken({ id: userExist._id });
    const refreshToken = generateRefreshToken({ id: userExist._id });
    userExist.refreshToken = refreshToken;
    await userExist.save();
    return res.status(200).json({ message: "User logged in successfully", data: { userExist, accessToken, refreshToken } });

}
export const verifyOtp = async (req, res, next) => {

    const { email, otp } = req.body;
    const userExist = await User.findOne({
        email
        , otp,
        otpExpiry: { $gt: Date.now() }
    });

    if (!userExist) {
        throw new Error("User not found", { cause: 404 });
    }


    userExist.isVerified = true;
    userExist.otp = undefined;
    userExist.otpExpiry = undefined;

    const accessToken = generateToken({ id: userExist._id });
    const refreshToken = generateRefreshToken({ id: userExist._id });
    userExist.refreshToken = refreshToken;
    await userExist.save();
    return res.status(200).json({ message: "User verified successfully", data: { userExist, accessToken, refreshToken } });

}
export const resendOtp = async (req, res, next) => {

    const { email } = req.body;
    const userExist = await User.findOne({ email });
    if (!userExist) {
        throw new Error("User not found", { cause: 404 });
    }
    const { otp, otpExpire } = generateOtp();
    await User.updateOne({ email }, { otp, otpExpiry: otpExpire });
    await sendEmail({
        to: email,
        subject: "re_send otp",
        html: `<p>click on the link to verify your email ${otp}</p>`
    })
    return res.status(200).json({ message: "Otp sent successfully", userExist });
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

    return res.status(200).json({ message: "User logged in successfully", data: { userExist, accessToken, refreshToken } });
}


export const refresh = async (req, res, next) => {
    const { Token } = req.body;
    if (!Token) {
        throw new Error("Refresh token is required", { cause: 401 });
    }

    const decoded = verifyRefreshToken(Token);
    const userId = decoded.id;
    const userExist = await User.findById(userId);

    if (!userExist) {
        throw new Error("User not found", { cause: 404 });
    }

    if (userExist.refreshToken !== Token) {
        throw new Error("Invalid refresh token", { cause: 401 });
    }

    const accessToken = generateToken({ id: userExist._id });
    const refreshToken = generateRefreshToken({ id: userExist._id });
    userExist.refreshToken = refreshToken;
    await userExist.save();

    return res.status(200).json({
        message: "User refreshed successfully",
        data: { userExist, accessToken, refreshToken }
    });
};

>>>>>>> master
