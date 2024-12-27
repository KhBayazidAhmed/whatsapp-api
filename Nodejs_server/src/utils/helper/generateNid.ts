import { Request, Response } from "express";
import generatePDF from "../generateTheNid.js";
import pkg from "whatsapp-web.js";
import logger from "../logger.js";
const { MessageMedia } = pkg;

type UserData = {
  nameEnglish: string;
  nameBangla: string;
  fatherName: string;
  motherName: string;
  nationalId: string;
  nidAddress: string;
  bloodGroup?: string;
  birthPlace: string;
  userImage: string;
  userSign?: string;
  dateOfBirth: string;
  pin: string;
  whatsAppNumber: string;
};

export default async function generateNid(req: Request, res: Response) {
  try {
    const data: UserData = req.body;

    // List of required fields (explicitly typed as keys of UserData)
    const requiredFields: (keyof UserData)[] = [
      "nameEnglish",
      "nameBangla",
      "fatherName",
      "motherName",
      "nationalId",
      "nidAddress",
      "birthPlace",
      "userImage",
      "dateOfBirth",
      "pin",
      "whatsAppNumber",
    ];

    // Check if any required field is missing
    for (const field of requiredFields) {
      if (!data[field]) {
        logger.warn(`[generateNid] Missing required field: ${field}`);
        res.status(400).json({ error: `${field} is required` });
        return;
      }
    }

    logger.info(
      "[generateNid] All required fields are present. Generating PDF..."
    );

    // Generate the NID PDF
    const nidPdf = await generatePDF(data, req.whatsappClient); // Pass userSign safely
    logger.info(
      `[generateNid] NID PDF generated successfully for National ID: ${data.nationalId}`
    );

    // Create WhatsApp media object
    const media = new MessageMedia(
      "application/pdf",
      nidPdf,
      `Nid-${data.nationalId}.pdf`
    );

    // Send the PDF via WhatsApp
    await req.whatsappClient.sendMessage(data.whatsAppNumber, media);
    logger.info(
      `[generateNid] NID PDF sent successfully to WhatsApp number: ${data.whatsAppNumber}`
    );

    // Respond with success
    res.status(200).json({ message: "NID PDF sent successfully!" });
    return;
  } catch (error: any) {
    // Log any errors that occur during the process
    logger.error(
      `[generateNid] Error generating or sending NID PDF: ${error.message}`
    );
    res.status(500).json({ error: "Failed to generate or send NID PDF" });
    return;
  }
}
