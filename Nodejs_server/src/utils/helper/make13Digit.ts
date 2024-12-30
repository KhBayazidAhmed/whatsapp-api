import { Client, Message } from "whatsapp-web.js";
import pkg from "whatsapp-web.js";
const { MessageMedia } = pkg;
import NIDData from "../../db/nid.model.js";
import generatePDF from "../generateTheNid.js";
import logger from "../logger.js";

export default async function make13Digit(msg: Message, client: Client) {
  try {
    // Ensure the message is a reply to another message
    if (!msg.hasQuotedMsg) return;

    const quotedMsg = await msg.getQuotedMessage();

    // Ensure the quoted message was sent by the bot itself
    if (!quotedMsg.fromMe) return;

    // Check if the quoted message contains media
    if (!quotedMsg.hasMedia) return;

    const media = await quotedMsg.downloadMedia();

    // Ensure the media has a valid filename
    if (!media?.filename) {
      logger.warn("Media filename is missing. Cannot process NID.");
      return;
    }

    // Extract the NID number from the filename (assumes format: nid-<nidNumber>.pdf)
    const nidNumber = extractNIDNumber(media.filename);
    if (!nidNumber) {
      logger.warn(`Invalid filename format: ${media.filename}`);
      return;
    }

    // Fetch NID data from the database
    const nidData = await fetchNIDData(nidNumber, msg.from);
    if (!nidData) return;

    // Generate the PDF with NID data
    const nidPdf = await generatePDF(nidData, client);
    if (!nidPdf) {
      logger.error(`Failed to generate PDF for NID: ${nidNumber}`);
      return;
    }

    // Prepare the media to send back
    const mediaToSend = new MessageMedia(
      "application/pdf",
      nidPdf,
      `nid-${nidData.nationalId}.pdf`
    );

    // Reply to the message with the generated NID PDF
    await msg.reply(mediaToSend, undefined, {
      caption: `Processed NID for ${nidData.nameEnglish}`,
    });

    logger.info(
      `Successfully processed and sent NID for: ${nidData.nameEnglish}`
    );
  } catch (error) {
    logger.error("Error in make13Digit function:", error);
  }
}

// Helper function to extract the NID number from the filename
function extractNIDNumber(filename: string) {
  try {
    const parts = filename.split(".");
    if (parts.length < 2) return null;

    const nidPart = parts[0].split("-");
    if (nidPart.length < 2) return null;

    return nidPart[1]; // The actual NID number
  } catch (error) {
    logger.error("Error extracting NID number from filename:", error);
    return null;
  }
}

// Helper function to fetch NID data from the database
async function fetchNIDData(nidNumber: string, whatsappNumber: string) {
  try {
    const nidData = await NIDData.findOne({ nationalId: nidNumber }).exec();
    if (!nidData) {
      logger.warn(`NID data not found for WhatsApp number: ${whatsappNumber}`);
      return null;
    }
    return {
      birthPlace: nidData.birthPlace,
      dateOfBirth: nidData.dateOfBirth,
      fatherName: nidData.fatherName,
      motherName: nidData.motherName,
      nameBangla: nidData.nameBangla,
      nameEnglish: nidData.nameEnglish,
      nidAddress: nidData.nidAddress,
      userImage: nidData.userImage,
      userSign: nidData.userSign,
      nationalId: nidData.voterNo,
      pin: nidData.pin,
    };
  } catch (error) {
    logger.error("Error fetching NID data from the database:", error);
    return null;
  }
}
