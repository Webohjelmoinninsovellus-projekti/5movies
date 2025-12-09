import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SECRET_KEY = process.env.BACKEND_SECRET_KEY;

export function verifyToken(req, res, next) {
  const token = req.cookies.JWT;

  if (!token) {
    res.status(403).json({ message: "Authorization header missing." });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) res.status(401).json({ message: "Invalid or expired token." });

    req.user = decoded;

    if (token) next();
  });
}
