import mongoose from "mongoose";

const connectDB=()=>{
    mongoose.connect("mongodb://127.0.0.1:27017/sarah_app")
    .then(()=>console.log("Connected to MongoDB"))
    .catch((err)=>console.log(err))
}


    
export default connectDB;