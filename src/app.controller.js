<<<<<<< HEAD
 import connectDB from "./db/connection.js";
 import * as modules from "./module/index.js";

 const bootstrap= async(app,express)=>{
    app.use(express.json());
    connectDB();
    app.use("/auth",modules.authrouter);
    app.use("/user",modules.userRouter);
    app.use("/message",modules.messageRouter);
}
export default bootstrap;
=======
 import connectDB from "./db/connection.js";
 import * as modules from "./module/index.js";
import fs from "fs";
 const bootstrap= async(app,express)=>{
    app.use(express.json());
    connectDB();
    app.use(express.static("uploads"));
    app.use("/auth",modules.authrouter);
    app.use("/user",modules.userRouter);
    app.use("/message",modules.messageRouter);
    app.use ((err,req,res,next)=>{
        if(req.file){
            fs.unlinkSync(req.file.path);
        }
   return res.status(err.cause || 500)
   .json({message:err.message,success:false, 
    stack:err.stack})
    });

}
export default bootstrap;
>>>>>>> master
