import{Schema,model} from "mongoose";
const schema=new Schema({
   
    receiver:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    content:{
        type:String,
        minlength:3,
        maxlength:1000,
        required:function(){
        if(this.attachment.length>0){
            return false;
        }
        return true;
        }
    },
    attachment:[{secure_url:String,public_id:String}],
    sender:{
        type:Schema.Types.ObjectId,
        ref:"User",
       
    }
},{timestamps:true});
const Message=model("Message",schema);
export default Message;
