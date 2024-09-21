import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { RequestValidationError } from "../errors/request-validation-error";
import { validateRequest } from "../middlewares/validation-request";

const router = express.Router();

router.post(
  "/api/users/signin",
  // list of middlewares
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password").trim().notEmpty().withMessage("Password needed!"),
  ],
  validateRequest,
  // routing method
  (req: Request, res: Response) => {
    res.send({ success: true });
  }
);

export { router as signInRouter };
