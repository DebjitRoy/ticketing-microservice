import express from "express";
import "express-async-errors"; // allows to throw inside async
import { json } from "body-parser";
import mongoose from "mongoose";
import cookieSession from "cookie-session";

import { currentUserRouter } from "./routes/current-user";
import { signInRouter } from "./routes/signin";
import { signOutRouter } from "./routes/signout";
import { signUpRouter } from "./routes/signup";
import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./errors/not-found-error";

const app = express();
app.set("trust proxy", true); // express is behind nginx, so allows https over proxy
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: true,
  })
);

app.use(currentUserRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.use(signUpRouter);

app.all("*", async () => {
  // we're able to throw inside async due to express-async-errors
  // without that, we'd have to next(new NotFoundError()) [from (req,res,next)]
  throw new NotFoundError();
});

app.use(errorHandler); // generic error handler mw

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT key must be defined!");
  }
  try {
    // mongo db cluster ip service name
    await mongoose.connect("mongodb://auth-mongo-srv:27017/auth");
    console.log("connected to mongodb");
  } catch (err) {
    console.log(err);
  }
  app.listen(3000, () => {
    console.log("Listening auth on 3000!!");
  });
};

start();
