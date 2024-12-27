import { Request, Response } from "express";
import { User } from "../../db/user.model.js";

export async function sendMessage(req: Request, res: Response): Promise<void> {
  try {
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
      res.status(500).json({ error: "WhatsApp client is not initialized." });
      return;
    }

    // Send messages concurrently
    const sendPromises = users.map((user) =>
      req.whatsappClient
        .sendMessage(user.whatsAppNumber, message)
        .catch((error) => {
          console.error(
            `Failed to send message to ${user.whatsAppNumber}:`,
            error
          );
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
  } catch (error) {
    console.error("Error in sendMessage:", error);
    res.status(500).json({ error: "Internal server error." });
  }
}
