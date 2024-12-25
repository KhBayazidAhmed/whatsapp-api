import { Request, Response } from "express";
import { User } from "../../db/user.model.js";

export async function addBalance(req: Request, res: Response): Promise<void> {
  try {
    const { id, amount } = req.body;

    // Validate input
    if (!id || typeof amount !== "number" || amount <= 0) {
      res
        .status(400)
        .json({
          message: "Invalid request: ID and positive amount are required",
        });
      return;
    }

    // Find user by ID
    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Update user's balance
    user.balance += amount;

    // Save updated user
    await user.save();

    res.status(200).json({
      message: "Balance added successfully",
      updatedBalance: user.balance, // Include updated balance in the response
    });
  } catch (error) {
    console.error("Error adding balance:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
