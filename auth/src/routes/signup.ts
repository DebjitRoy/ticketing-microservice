import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { RequestValidationError } from "../errors/request-validation-error";
import { User } from "../models/user";
import { BadRequestError } from "../errors/bad-request-error";

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
    res.status(201).send(user);
  }
);

export { router as signUpRouter };
