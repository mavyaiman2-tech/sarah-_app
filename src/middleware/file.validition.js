import { fileTypeFromBuffer } from "file-type";
import fs from "fs";

export const fileValidationMiddleware = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // جلب بيانات الملف
    let buffer;
    if (req.file.path) {
      buffer = fs.readFileSync(req.file.path); // من disk storage
    } else if (req.file.buffer) {
      buffer = req.file.buffer; // من memory storage
    } else {
      return res.status(400).json({ message: "Invalid file data" });
    }

    // التحقق من نوع الملف
    const type = await fileTypeFromBuffer(buffer);
    const allowedTypes = ["image/jpeg", "image/png"];

    if (!type || !allowedTypes.includes(type.mime)) {
      return res.status(400).json({ message: "Invalid file type" });
    }

    next();
  } catch (error) {
    console.error("File validation error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
