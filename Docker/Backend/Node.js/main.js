import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import userRouter from "./routers/userRouter.js";
import reviewRouter from "./routers/reviewRouter.js";
import favoriteRouter from "./routers/favoriteRouter.js";

dotenv.config();

const app = express();
app.use(cors({ credentials: true, origin: "http://localhost:5556" }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/user", userRouter);
app.use("/review", reviewRouter);
app.use("/favorite", favoriteRouter);

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
