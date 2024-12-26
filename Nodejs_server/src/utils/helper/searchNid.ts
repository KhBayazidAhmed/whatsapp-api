import { Request, Response } from "express";
import NIDData from "../../db/nid.model.js";

export default async function searchNid(req: Request, res: Response) {
  try {
    // Validate that the search query is provided
    if (!req.query.q) {
      res.status(400).json({ error: "Search query is required." });
      return;
    }

    const searchQuery = req.query.q as string;

    // Search the database for the nationalId field
    const nid = await NIDData.findOne({ nationalId: searchQuery }).populate({
      path: "user",
      select: "whatsAppNumber",
    });
    // If no document is found, return a 404 error
    if (!nid || nid.length === 0) {
      res
        .status(404)
        .json({ error: "No NID found with the given national ID." });
      return;
    }

    // Send the search results
    res.json(nid);
  } catch (error) {
    // Handle any errors that occur during the search process
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while searching NID data." });
  }
}
