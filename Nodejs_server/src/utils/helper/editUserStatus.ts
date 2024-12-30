import { Request, Response } from "express";
import { User } from "../../db/user.model.js";
import logger from "../logger.js";

export async function editUserStatus(req: Request, res: Response) {
  try {
    const { id } = req.body;
    const user = await User.findById(id);
    if (!user) {
      logger.warn(`[editUserStatus] User not found with ID: ${id}`);
      res.status(404).json({ message: "User not found" });
      return;
    }
    user.isActive = !user.isActive;
    await user.save();
    res.status(200).json({ message: "User status updated successfully." });
    req.whatsappClient.sendMessage(
      user.whatsAppNumber,
      `Your status has been ${user.isActive ? "Active" : "Deactivated"}.`
    );
  } catch (error) {
    logger.error(
      "[editUserStatus] Error occurred while updating user status.",
      { error }
    );
    res.status(500).json({ message: "Internal server error" });
  }
}
