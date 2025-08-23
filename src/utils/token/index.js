import jwt from "jsonwebtoken";


export const generateToken = (payload) => {
 
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });
};

export const generateRefreshToken = (payload) => {
 
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
};

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET); 
} 
export const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
} 