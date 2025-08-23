import connectDB from "./db/connection.js";
import * as modules from "./module/index.js";
import { globalErrorHandler } from "./utils/error/index.js";
import { rateLimit } from "express-rate-limit";


import fs from "fs";
    const bootstrap = async (app, express) => {
    const limiter = rateLimit({
        windowMs: 60 * 1000,
        limit: 50,
        message: "Too many requests from this IP, please try again after 1 minute",
        handler: (req, res, next, options) => {
            throw new Error(options.message, { cause: 429 });
        },
        skipSuccessfulRequests: true,

    });
  
    app.use(limiter);
    app.use(express.json());
    connectDB();
    app.use(express.static("uploads"));
    app.use("/auth", modules.authrouter);
    app.use("/user", modules.userRouter);
    app.use("/message", modules.messageRouter);    
    app.use ((err,req,res,next)=>{
        if(req.file){
            fs.unlinkSync(req.file.path);
        }
   return res.status(err.cause || 500)
   .json({message:err.message,success:false, 
    stack:err.stack})
    });
    app.use(globalErrorHandler);

}

export default bootstrap;
