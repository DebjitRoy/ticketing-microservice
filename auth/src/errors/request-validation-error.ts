import { ValidationError } from "express-validator";
import { CustomError } from "./custom-error";

export class RequestValidationError extends CustomError {
  statusCode = 400;
  // 'private' errors is same as this.errors = errors
  constructor(public errors: ValidationError[]) {
    super("RequestValidationError"); // logging purpose

    // Only because we're extending a built-in class
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }
  serializeErrors() {
    return this.errors.map((error) => ({
      message: error.msg,
      ...(error.type === "field" && { field: error.path }),
    }));
  }
}
