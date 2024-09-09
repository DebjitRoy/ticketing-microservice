// abstract classes can't be instantiated
// abstract classes are available in run time, instanceOf check, unlike interfaces
export abstract class CustomError extends Error {
  abstract statusCode: number;
  constructor(message: string) {
    super(message);
    // Only because we're extending a built-in class
    Object.setPrototypeOf(this, CustomError.prototype);
  }
  abstract serializeErrors(): {
    message: string;
    field?: string;
  }[];
}
