import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SECRET_KEY = process.env.BACKEND_SECRET_KEY;

export function verifyToken(req, res, next) {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(403).json({ message: "Authorization header missing" });
  }

  const token = header.split(" ")[1];

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) res.status(401).json({ message: "Invalid or expired token" });

    req.user = decoded;
    next();
  });
}
