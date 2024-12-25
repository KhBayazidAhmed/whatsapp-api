import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../../db/user.model.js";
import { IUser } from "../../db/user.model.js";

// The JWT secret should be stored in an environment variable for security
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { whatsAppNumber, password } = req.body;

    // Validate input
    if (!whatsAppNumber || !password) {
      res
        .status(400)
        .json({ message: "WhatsApp number and password are required" });
      return;
    }

    // Find user by WhatsApp number
    const user: IUser | null = await User.findOne({ whatsAppNumber });
    if (!user) {
      res.status(401).json({ message: "User not Found" });
      return;
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = await user.comparePassword(password);
    console.log(isMatch);
    if (!isMatch) {
      res.status(401).json({ message: "Invalid WhatsApp number or password" });
      return;
    }

    // Create JWT payload (add user details like ID, name, role, and balance)
    const payload = {
      userId: user._id,
      name: user.name,
      whatsAppNumber: user.whatsAppNumber,
      role: user.role,
      balance: user.balance,
    };

    // Generate JWT token (expires in 1 hour)
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

    // Send response with token
    res.json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
