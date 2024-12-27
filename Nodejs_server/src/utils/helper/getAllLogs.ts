import Log from "../../db/logs.model.js";
import { Request, Response } from "express";

/**
 * Function to fetch the last 50 logs from MongoDB
 * @param req - Express request object
 * @param res - Express response object
 * @returns {Promise<void>} - Returns nothing, sends the logs in the response
 */
async function getLast50Logs(req: Request, res: Response): Promise<void> {
  try {
    // Optionally, add query parameters for filtering (e.g., by log level)
    const { level } = req.query;

    // Build the query filter
    const filter: any = {};
    if (level) {
      filter.level = level; // Add level filter if provided
    }

    // Fetch the last 50 logs, sorted by timestamp in descending order
    const logs = await Log.find(filter).sort({ timestamp: -1 }).limit(50);

    // Send the response with the logs
    res.status(200).json({
      success: true,
      message: "Last 50 logs fetched successfully",
      data: logs,
    });
  } catch (error: any) {
    console.error("Error fetching logs:", error);

    // Send a response with a proper error message
    res.status(500).json({
      success: false,
      message: "Error fetching logs",
      error: error.message || error,
    });
  }
}

export default getLast50Logs;
