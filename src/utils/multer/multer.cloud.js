

import multer from "multer";
import { nanoid } from "nanoid";
import fs from "fs";

export function fileuploadcloud(){
 
  if (!fs.existsSync("uploads")) {
    fs.mkdirSync("uploads");
  }

  const storage = multer.diskStorage({
    
  });// temp storage

  
  
  return multer({ storage,});
}
