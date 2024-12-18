import express, { Request, Response } from "express";
import extractAndSaveImages from "./lib/imageExtraction.js";

const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(express.json({ limit: "10mb" }));

// Route to handle image extraction
app.post("/extract-images", async (req: Request, res: Response) => {
  const { pdfBase64 } = req.body;

  if (!pdfBase64) {
    return res.status(400).json({
      message: "No PDF base64 provided",
    });
  }

  try {
    console.log("Base64 PDF received. Extracting images...");
    const pdfBuffer = Uint8Array.from(Buffer.from(pdfBase64, "base64"));
    const extractedImages = await extractAndSaveImages(pdfBuffer);

    return res.json({
      message: "Images extracted successfully",
      images: extractedImages,
    });
  } catch (error: any) {
    console.error("Error while extracting images:", error.message);
    return res.status(500).json({
      error: "Failed to extract images from PDF",
      details: error.message,
    });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
