import { CustomError } from "./custom-error";

export class BadRequestError extends CustomError {
  statusCode = 400;
  constructor(private reason: string) {
    super(reason);

    // Only because we're extending a built-in class
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
  serializeErrors() {
    return [
      {
        message: this.reason,
      },
    ];
  }
}
