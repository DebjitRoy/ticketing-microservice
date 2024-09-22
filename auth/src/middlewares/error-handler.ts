import { Request, Response, NextFunction } from "express";
import { CustomError } from "../errors/custom-error";

// error handler mw has 4 arguments
// generally all other middlewates has 3 args - req,res,next
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }
  res.status(400).send({
    errors: [{ message: "Something went wrong" }],
  });
};
