import { Request, Response } from "express";
import generatePDF from "../generateTheNid.js";
import pkg from "whatsapp-web.js";
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
        res.status(400).json({ error: `${field} is required` });
        return;
      }
    }

    // Generate the NID PDF
    const nidPdf = await generatePDF(data, req.whatsappClient); // Pass userSign safely

    // Create WhatsApp media object
    const media = new MessageMedia(
      "application/pdf",
      nidPdf,
      `Nid-${data.nationalId}-edited.pdf`
    );

    // Send the PDF via WhatsApp
    await req.whatsappClient.sendMessage(data.whatsAppNumber, media);

    // Respond with success
    res.status(200).json({ message: "NID PDF sent successfully!" });
    return;
  } catch (error) {
    console.error("Error generating NID:", error);
    res.status(500).json({ error: "Failed to generate or send NID PDF" });
    return;
  }
}
