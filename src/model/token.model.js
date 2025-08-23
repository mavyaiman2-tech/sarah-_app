import mongoose from "mongoose";

const schema = new mongoose.Schema({
    token: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    type: {
        type: String,
        enum: ["refresh", "access"],
        default: "access"
    },
    
}, { timestamps: true });


export const Token = mongoose.model("Token", schema);
