import { Request, Response } from "express";
import NIDData from "../../db/nid.model.js";
import logger from "../logger.js";

export default async function getAllNid(req: Request, res: Response) {
  try {
    // Extract page and limit from query parameters with defaults
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;

    // Calculate the number of documents to skip
    const skip = (page - 1) * limit;

    const nid = await NIDData.find(
      {},
      { nationalId: 1, nameEnglish: 1, _id: 1 }
    )
      .populate({
        path: "user",
        select: "whatsAppNumber",
      })
      .skip(skip)
      .limit(limit);

    // Get total document count for metadata
    const totalDocuments = await NIDData.countDocuments();

    // Send paginated data along with metadata
    res.json({
      data: nid,
      meta: {
        totalDocuments,
        currentPage: page,
        totalPages: Math.ceil(totalDocuments / limit),
        limit,
      },
    });

    // Log the successful response
  } catch (error: any) {
    // Log errors
    logger.error(
      `[getAllNid] Error occurred while fetching NID data: ${error.message}`
    );
    res
      .status(500)
      .json({ error: "An error occurred while fetching NID data." });
  }
}
