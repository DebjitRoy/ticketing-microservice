import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface UserPayload {
  id: string;
  email: string;
}

// option 1: extend Requst type to include additional prop
// export interface RequestWithUser extends Request {
//   currentUser?: UserPayload;
// }

//option2: use global namespace to add additional property to existing type
declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session?.jwt) {
    return next();
  }
  try {
    const payload = jwt.verify(
      req.session.jwt,
      process.env.JWT_KEY!
    ) as UserPayload;
    req.currentUser = payload; // add additional data to request
  } catch (e) {
    console.log("error verifying jwt ");
  }
  next();
};
