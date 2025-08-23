import {uploadfiles} from "../../utils/cloud/index.js";
import Message from "../../model/message.model.js";
export const sendMessage = async (req, res, next) => {


    const { content } = req.body;
    const { receiver } = req.params;
    const files = req.files;

   const attachments
   =
   await uploadfiles({files,options:{folder:`sarah_app/messages/${receiver}/messages`}})
    await Message.create({
        receiver,
        content,
        attachments,
        sender: req.user?._id
    })
    return res.status(201)
        .json({ message: "Message sent successfully", success: true });
}

export const getMessages = async (req, res, next) => {
    const { id } = req.params;
  const messages=await Message.findOne
  ({_id:id ,receiver:req.user._id},{},{
    populate:{
        path:"receiver",
        select:"-password -deletedAt -credentialsUpdateAt -__v"
    }
  });
  if(!messages){
    throw new Error("Message not found",{cause:404});
  }





    return res.status(200)
        .json({ message: "Messages fetched successfully", success: true, data: messages });
}
