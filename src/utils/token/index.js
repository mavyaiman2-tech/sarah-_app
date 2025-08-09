import jwt from "jsonwebtoken";

const secretKey = "secret";
const refreshSecret = "refresh";

export const generateToken = (payload) => {
  return jwt.sign(payload, secretKey, { expiresIn: "1h" });
};

export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, refreshSecret, { expiresIn: "7d" });
};

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, refreshSecret);
};
