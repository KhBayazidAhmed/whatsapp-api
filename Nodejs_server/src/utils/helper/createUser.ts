import { NextFunction, Request, Response } from "express";
import { User } from "../../db/user.model.js";
import { IUser } from "../../db/user.model.js";

export async function createUser(req: Request, res: Response): Promise<void> {
  try {
    const { name, whatsAppNumber, password, price } = req.body;

    // Validate required fields
    if (!name || !whatsAppNumber) {
      res.status(400).json({ message: "Name, WhatsApp number are required." });
      return;
    }

    // Check for existing user with the same WhatsApp number
    const existingUser = await User.findOne({ whatsAppNumber });
    if (existingUser) {
      res
        .status(409)
        .json({ message: "A user with this WhatsApp number already exists." });
      return;
    }

    // Create the user
    const user: IUser = new User({
      name,
      whatsAppNumber,
      password,
      role: "user",
      balance: 0,
      price,
    });

    // Save to the database
    await user.save();

    // Respond with success
    res.status(201).json({
      message: "User created successfully.",
      user: {
        id: user._id,
        name: user.name,
        whatsAppNumber: user.whatsAppNumber,
        role: user.role,
        balance: user.balance,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res
      .status(500)
      .json({ message: "Internal server error. Please try again later." });
  }
}
