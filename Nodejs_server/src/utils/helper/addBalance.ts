import { Request, Response } from "express";
import { User } from "../../db/user.model.js";
import logger from "../logger.js";

export async function addBalance(req: Request, res: Response): Promise<void> {
  try {
    const { id, amount } = req.body;

    // Validate input
    if (!id || typeof amount !== "number" || amount <= 0) {
      res.status(400).json({
        message: "Invalid request: ID and positive amount are required",
      });
      return;
    }

    // Find user by ID
    const user = await User.findById(id);
    if (!user) {
      logger.warn(`[addBalance] User not found with ID: ${id}`);
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Log the current balance before update
    logger.info(
      `[addBalance] Current balance for user ID: ${id} is ${user.balance}`
    );

    // Update user's balance
    user.balance += amount;

    // Save updated user
    await user.save();

    // Log the updated balance
    logger.info(
      `[addBalance] User ID: ${id} balance updated. New balance: ${user.balance}`
    );

    res.status(200).json({
      message: "Balance added successfully",
      updatedBalance: user.balance, // Include updated balance in the response
    });
  } catch (error: any) {
    // Log unexpected errors
    logger.error(
      `[addBalance] Error adding balance for user ID: ${req.body.id}. Error: ${error.message}`
    );
    res.status(500).json({ message: "Internal server error" });
  }
}
