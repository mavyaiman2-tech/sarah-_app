import mongoose from "mongoose";
const { model, Schema } = mongoose;

const schema = new Schema({
    firstName: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    email: {
        type: String,
        required: function () {
            return !this.phoneNumber;
        },
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: function () {
            return this.userAgent !== "google";
        }
    },
    phoneNumber: {
        type: String,
        required: function () {
            return !this.email;
        },
        trim: true
    },
    dob: {
        type: Date
    },
    otp: {
        type: String
    },
    otpExpiry: {
        type: Date
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    userAgent: {
        type: String,
        enum: ["local", "google"],
        default: "local"
    },
   

    profile:{
        secure_url:String,  
        public_id:String,
    },  
    credentialsUpdateAt:{
        type:Date,
        default:Date.now(),
    },
    deletedAt:{
        type:Date,
  
    },
   
}, {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});
schema.virtual("messages",{
    ref:"Message",
    localField:"_id",
    foreignField:"receiver"
})

schema.virtual("fullName").get(function () {
    return `${this.firstName} ${this.lastName}`;
});
schema.virtual("fullName").set(function (value) {
    const parts = value.split(" ");
    this.firstName = parts[0];
    this.lastName = parts[1] || "";
});

schema.virtual("age").get(function () {
    return new Date().getFullYear() - this.dob.getFullYear();
});

const User = model("User", schema);
export default User;
