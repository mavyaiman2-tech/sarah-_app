<<<<<<< HEAD
import mongoose from "mongoose";
const { model, Schema } = mongoose;
const schema = new Schema({
    firstName:
    {
        type: String,
        required: true,
        lowercase: true,
        trim:true
    },
    lastName: {
        type: String,
        required: true,
        lowercase: true,
        trim:true
    },
    email: {
        type: String,
        required:function(){
            if(this.phone){return false;}
            return true;
        },
       
        trim:true
    },
    password: {
        type: String,
        required: true 
    },
    phoneNumber:{
        type:String,
        required:function(){
            if(this.email){return false;}
            return true;
        },
        trim:true
    },
    dob:{
        type:Date,
       
    },
    otp:{
        type:Number,
    },
    otpExpiry:{
        type:Date,
    },
    
}
,{timestamps:true , toObject:{virtuals:true},toJSON:{virtuals:true}});

schema.virtual ("fullName").get(function(){
    return `${this.firstName} ${this.lastName}`;
})

schema.virtual("fullName").set(function (value) {
    const parts = value.split(" ");
    this.firstName = parts[0];
    this.lastName = parts[1] || "";
  });
 schema.virtual("age").get(function(){
    return new Date().getFullYear() - this.dob.getFullYear();
})

 const User =model("User",schema);
export default User;
=======
import mongoose from "mongoose";
const { model, Schema } = mongoose;
const schema = new Schema({
    firstName:
    {
        type: String,
        required: true,
        lowercase: true,
        trim:true
    },
    lastName: {
        type: String,
        required: true,
        lowercase: true,
        trim:true
    },
    email: {
        type: String,
        required:function(){
            if(this.phone){return false;}
            return true;
        },
       
        trim:true
    },
    password: {
        type: String,
        required: function(){
            if(this.userAgent==="google"){return false;}
            return true;
        }
    },
    phoneNumber:{
        type:String,
        required:function(){
            if(this.email){return false;}
            return true;
        },
        trim:true
    },
    dob:{
        type:Date,
       
    },
    otp:{
        type:Number,
    },
    otpExpiry:{
        type:Date,
    },
    userAgent:{
        type:String,
        enum:["local","google"],
        default:"local"
    }
}
,{timestamps:true , toObject:{virtuals:true},toJSON:{virtuals:true}});

schema.virtual ("fullName").get(function(){
    return `${this.firstName} ${this.lastName}`;
})

schema.virtual("fullName").set(function (value) {
    const parts = value.split(" ");
    this.firstName = parts[0];
    this.lastName = parts[1] || "";
  });
 schema.virtual("age").get(function(){
    return new Date().getFullYear() - this.dob.getFullYear();
})

 const User =model("User",schema);
export default User;
>>>>>>> master
