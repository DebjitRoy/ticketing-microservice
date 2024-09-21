import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { RequestValidationError } from "../errors/request-validation-error";

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errs = validationResult(req);
  if (!errs.isEmpty()) {
    throw new RequestValidationError(errs.array());
  }
  next();
};
