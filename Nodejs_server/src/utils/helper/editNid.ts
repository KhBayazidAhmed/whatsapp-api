import { Request, Response } from "express";
import NIDData from "../../db/nid.model.js";

export default async function editNid(req: Request, res: Response) {
  try {
    // Validate that the ID is provided
    if (!req.params.id) {
      res.status(400).json({ error: "NID ID is required." });
      return;
    }

    // Validate that the request body has data to update
    if (Object.keys(req.body).length === 0) {
      res.status(400).json({ error: "No data provided to update." });
      return;
    }

    // Find and update the document without creating a new one
    const nid = await NIDData.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      upsert: false,
    });

    // Check if the document exists
    if (!nid) {
      res.status(404).json({ error: "NID not found." });
      return;
    }

    // Return the updated document
    res.json(nid);
  } catch (error) {
    // Handle any errors that occur during the update process
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while updating NID data." });
  }
}
