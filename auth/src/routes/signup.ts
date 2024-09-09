import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { RequestValidationError } from "../errors/request-validation-error";
import { DatabaseConnectionError } from "../errors/database-connection-error";

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
  (req: Request, res: Response) => {
    const errs = validationResult(req);
    if (!errs.isEmpty()) {
      throw new RequestValidationError(errs.array());
    }
    const { email, password } = req.body;
    console.log("Creating user", req.body);
    throw new DatabaseConnectionError();
    res.send("SignUp");
  }
);

export { router as signUpRouter };
