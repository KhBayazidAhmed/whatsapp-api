import { Request, Response } from "express";
import NIDData from "../../db/nid.model.js";
import logger from "../logger.js";

export default async function searchNid(req: Request, res: Response) {
  try {
    // Validate that the search query is provided
    const searchQuery = req.query.q as string;
    if (!searchQuery) {
      logger.warn("[searchNid] No search query provided.");
      res.status(400).json({ error: "Search query is required." });
      return;
    }

    // Search the database for the nationalId field
    const nid = await NIDData.findOne({ nationalId: searchQuery }).populate({
      path: "user",
      select: "whatsAppNumber",
    });

    // If no document is found, return a 404 error
    if (!nid) {
      logger.warn(`[searchNid] No NID found for National ID: ${searchQuery}`);
      res
        .status(404)
        .json({ error: "No NID found with the given national ID." });
      return;
    }

    // Send the search results
    res.json(nid);
  } catch (error: any) {
    // Log any error that occurs during the search process
    logger.error(
      `[searchNid] Error occurred while searching NID: ${error.message}`
    );
    res
      .status(500)
      .json({ error: "An error occurred while searching NID data." });
  }
}
