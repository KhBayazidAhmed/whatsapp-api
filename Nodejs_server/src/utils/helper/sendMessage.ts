import { Request, Response } from "express";
import { User } from "../../db/user.model.js";
import logger from "../logger.js";

export async function sendMessage(req: Request, res: Response): Promise<void> {
  try {
    // Log the start of the process

    // Retrieve all users from the database
    const users = await User.find();
    if (!users || users.length === 0) {
      res.status(404).json({ error: "No users found." });
      return;
    }

    // Extract message from the request body
    const { message } = req.body;
    if (!message) {
      res.status(400).json({ error: "Message content is required." });
      return;
    }

    // Ensure req.whatsappClient is available
    if (
      !req.whatsappClient ||
      typeof req.whatsappClient.sendMessage !== "function"
    ) {
      logger.error(`[sendMessage] WhatsApp client is not initialized.`);
      res.status(500).json({ error: "WhatsApp client is not initialized." });
      return;
    }

    // Send messages concurrently
    const sendPromises = users.map((user) =>
      req.whatsappClient
        .sendMessage(user.whatsAppNumber, message)
        .then(() => {
          return { success: true, number: user.whatsAppNumber };
        })
        .catch((error) => {
          return { success: false, number: user.whatsAppNumber, error };
        })
    );

    const results = await Promise.all(sendPromises);

    // Separate successful and failed messages
    const successes = results.filter(
      (result) => "success" in result && result.success !== false
    );
    const failures = results.filter(
      (result) => "success" in result && result.success === false
    );

    // Respond with success and failure counts
    res.status(200).json({
      success: successes.length,
      failed: failures.length,
      failures,
    });
  } catch (error: any) {
    // Log unexpected errors
    logger.error(`[sendMessage] Error occurred: ${error.message}`);
    res.status(500).json({ error: "Internal server error." });
  }
}
