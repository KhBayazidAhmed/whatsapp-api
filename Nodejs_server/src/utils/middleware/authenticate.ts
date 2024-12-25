import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { IUser } from "../../db/user.model.js"; // Make sure to import the IUser model

// Middleware to authenticate JWT token
export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Make sure to return void
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    // Send response and return void
    res.status(403).json({ message: "Access denied. No token provided." });
    return;
  }

  try {
    // Verify the token and extract user info
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    );
    // Attach user info to request object
    req.user = decoded as IUser;

    // Proceed to the next middleware or route handler
    next(); // Call next() without returning anything
  } catch (err) {
    // Send response and return void
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
