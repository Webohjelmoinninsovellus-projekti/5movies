import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import tmdbRouter from "./routers/tmdbRouter.js";
import userRouter from "./routers/userRouter.js";
import reviewRouter from "./routers/reviewRouter.js";
import favoriteRouter from "./routers/favoriteRouter.js";
import groupRouter from "./routers/groupRouter.js";
import avatarRouter from "./routers/avatarRouter.js";

dotenv.config();

const app = express();
app.use(cors({ credentials: true, origin: process.env.REACT_IP }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/tmdb", tmdbRouter);
app.use("/user", userRouter);
app.use("/review", reviewRouter);
app.use("/favorite", favoriteRouter);
app.use("/group", groupRouter);
app.use("/avatar", avatarRouter);
app.use("/uploads", express.static("uploads"));

const port = process.env.BACKEND_PORT || 5555;

app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    error: {
      message: err.message,
      status: statusCode,
    },
  });
});

app.listen(port, () =>
  console.log(`Server running on port ${port}, http://localhost:${port}`)
);
