import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";
import { validateRequest } from "../middlewares/validation-request";
import { User } from "../models/user";
import { BadRequestError } from "../errors/bad-request-error";
import { Password } from "../services/password";

const router = express.Router();

router.post(
  "/api/users/signin",
  // list of middlewares
  // middlewares for body validation
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password").trim().notEmpty().withMessage("Password needed!"),
  ],
  // middleware  to validate request valid
  validateRequest,
  // routing method
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError("Invalid credentials");
    }
    const storedPass = existingUser.password;
    const authenticated = await Password.compare(storedPass, password);

    if (!authenticated) {
      throw new BadRequestError("Invalid credentials");
    }

    // Generate JWT
    let userJwt;
    userJwt = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      process.env.JWT_KEY! // we've already checked the env var available on app startup
    );

    // Store it on session object
    // cookieSession using middleware - only using https as secure is set to true
    req.session = { jwt: userJwt };

    res.status(200).send(existingUser);
  }
);

export { router as signInRouter };
