import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { RequestValidationError } from "../errors/request-validation-error";
import { User } from "../models/user";
import { BadRequestError } from "../errors/bad-request-error";
import jwt from "jsonwebtoken";
const router = express.Router();

router.post(
  "/api/users/signup",
  // middlewares for body validation
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 chars"),
  ],
  async (req: Request, res: Response) => {
    const errs = validationResult(req);
    if (!errs.isEmpty()) {
      throw new RequestValidationError(errs.array());
    }
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new BadRequestError("user already exists");
    }

    const user = User.build({ email, password });
    await user.save();

    let userJwt;
    try {
      // Generate JWT
      userJwt = jwt.sign(
        {
          id: user.id,
          email: user.email,
        },
        process.env.JWT_KEY! // we've already checked the env var available on app startup
      );
    } catch (err) {
      console.log(err);
    }

    // Store it on session object
    // cookieSession using middleware - only using https as secure is set to true
    req.session = { jwt: userJwt };

    res.status(201).send(user);
  }
);

export { router as signUpRouter };
