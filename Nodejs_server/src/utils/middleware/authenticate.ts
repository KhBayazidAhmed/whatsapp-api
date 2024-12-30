import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { IUser } from "../../db/user.model.js"; // Make sure to import the IUser model
import logger from "../logger.js";

// Middleware to authenticate JWT token
export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Log the incoming request for authentication

  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    // Log the absence of a token

    res
      .status(403)
      .json({ message: "Access denied. No token provided.", failedAuth: true });
    return;
  }

  try {
    // Log the attempt to verify the token

    // Verify the token and extract user info
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    // Attach user info to request object
    req.user = decoded as IUser;

    // Proceed to the next middleware or route handler
    next(); // Call next() without returning anything
  } catch (err: any) {
    // Log the error if token verification fails
    logger.error(
      `[authenticateJWT] Failed to verify token for request from ${req.ip}: ${err.message}`
    );
    res
      .status(401)
      .json({ message: "Invalid or expired token", failedAuth: true });
  }
};
