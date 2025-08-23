

import multer from "multer";
import { nanoid } from "nanoid";
import fs from "fs";

export function fileupload() {
 
  if (!fs.existsSync("uploads")) {
    fs.mkdirSync("uploads");
  }

  const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
      let dest=
      `uploads/${req.user._id}`;
      if(!fs.existsSync(dest)){
        fs.mkdirSync(dest);
      }
        cb(null,dest);
    },
    filename: (req, file, cb) => {
    
     
      const uniqueName = `${nanoid(5)}_${file.originalname}`;
      cb(null, uniqueName);
    },
  });

  
  
  return multer({ storageوlimits: { fileSize: 2 * 1024 * 1024 },});
}
