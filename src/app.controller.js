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
