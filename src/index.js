import express from "express";
import bootstrap from "./app.controller.js";
import User from "./model/user.model.js";
import mongoose from "mongoose";
import schedule from "node-schedule";
import { deletefolder } from "./utils/cloud/index.js";

schedule.scheduleJob("1 2 3 * * *",async()=>{
    const users=await User.find
    ({deletedAt:{$lte:Date.now()-3*30*24*60*60*1000}});
    for(const user of users){
      if(user.profile.public_id){
        deletefolder(`sarah_app/users/${user._id}`);
      }
    
    }
    await User.deleteMany({deletedAt:{$lte:Date.now()-3*30*24*60*60*1000}}) ;
})

const app = express();
const port=process.env.PORT;    
 await bootstrap(app,express);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
