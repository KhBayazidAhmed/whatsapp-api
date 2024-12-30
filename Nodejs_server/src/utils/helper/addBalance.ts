import { Request, Response } from "express";
import { User } from "../../db/user.model.js";
import logger from "../logger.js";
import BalanceTransition from "../../db/BalanceTransition.model.js";
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
      `[addBalance] Current balance for user what'sApp number: ${
        user.whatsAppNumber
      } is ${user.balance} before adding ${amount} after adding balance ${
        user.balance + amount
      }`
    );

    await BalanceTransition.create({
      userId: id,
      type: "recharge",
      amount,
      balanceAfter: user.balance,
    });
    // Update user's balance
    user.balance += amount;
    // Save updated user
    await user.save();
    req.whatsappClient.sendMessage(
      user.whatsAppNumber,
      `Your balance has been updated to ${user.balance} after adding ${amount}!`
    );
    // Log the updated balance
    logger.info(
      `[addBalance] User what'sApp number: ${user.whatsAppNumber} balance updated. New balance: ${user.balance}`
    );

    res.status(200).json({
      message: "Balance added successfully",
      updatedBalance: user.balance, // Include updated balance in the response
    });
  } catch (error: any) {
    // Log unexpected errors
    logger.error(
      `[addBalance] Error adding balance for user ID: ${req.body.id}. Error: ${error.message} whatsAppNumber: ${req.body.whatsAppNumber}`
    );
    res.status(500).json({ message: "Internal server error" });
  }
}
