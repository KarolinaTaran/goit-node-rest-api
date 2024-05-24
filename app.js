import createError from "http-errors";
import express from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";

import usersRouter from "./routes/contactsRouter.js";
import userRouter from "./routes/users.js";
import "./db/contacts.js";
const app = express();

const PORT = process.env.PORT || 8080;

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api/contacts", usersRouter);
app.use("/users", userRouter);
app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  if (!err) {
    return next();
  }
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message,
      stack: err.stack,
    },
  });
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
