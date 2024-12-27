import { Client, Message } from "whatsapp-web.js";
import pkg from "whatsapp-web.js";
const { MessageMedia } = pkg;
import extractTextFromBase64 from "../utils/extractTextFromPdfWithPython.js";
import formatTheString from "../utils/formatTheString.js";
import generatePDF from "../utils/generateTheNid.js";
import NIDData from "../db/nid.model.js";
import { User } from "../db/user.model.js";
import fetchImagesWithRetry from "../utils/helper/fetchImagesWithRetryForImageExtraction.js";
import logger from "../utils/logger.js";
import { getProfileDetails } from "../utils/helper/profileDetails.js";

interface ApiResponse {
  text: string;
}

interface Image {
  base64: string;
  filename: string;
}

export default function processTheInComingMessage(client: Client) {
  client.on("message", async (msg: Message) => {
    try {
      logger.info(`Received a new message from ${msg.from}`);
      const user = await User.findOne({ whatsAppNumber: msg.from }).exec();
      if (!user) {
        logger.warn(`User not found for WhatsApp number: ${msg.from}`);
        return;
      }
      if (msg.body === "/profile") {
        await getProfileDetails(msg);
        return;
      }
      if (!msg.hasMedia) {
        await msg.reply("Please send a valid PDF file for processing.");
        return;
      }
      const processingCost = user.price || 5;
      if (user.balance < processingCost) {
        logger.warn(`Insufficient balance for user: ${msg.from}`);
        await msg.reply(
          `Insufficient balance. Your current balance is ${user.balance}. Please recharge to continue.`
        );
        return;
      }

      const media = await msg.downloadMedia();
      if (!media || media.mimetype !== "application/pdf") {
        await msg.reply(
          "This is not a valid PDF file. Please send a valid NID PDF."
        );
        return;
      }

      const extractedText: ApiResponse = await extractTextFromBase64(
        media.data
      );

      if (!extractedText?.text) {
        logger.error("Failed to extract text from PDF.");
        await msg.reply(
          "Failed to extract text from the PDF. Please try again."
        );
        return;
      }

      const formattedText = formatTheString(extractedText.text);

      if (
        !formattedText.nationalId ||
        !formattedText.nameBangla ||
        !formattedText.nameEnglish ||
        !formattedText.dateOfBirth ||
        !formattedText.birthPlace ||
        !formattedText.fatherName ||
        !formattedText.motherName
      ) {
        logger.warn("Invalid NID PDF format.");
        await msg.reply("This is not a valid NID PDF file.");
        return;
      }

      try {
        const images = await fetchImagesWithRetry(media.data);
        if (!images?.images) {
          throw new Error("Failed to fetch sufficient images.");
        }
        formattedText.userImage = getImageBase64(images?.images[0]) as string;
        formattedText.userSign = getImageBase64(images?.images[1]);

        const existingNid = await NIDData.findOne({
          nationalId: formattedText.nationalId,
          user: user._id,
        });

        if (!existingNid) {
          const nid = await NIDData.create({
            ...formattedText,
            user: user._id,
          });

          await user.updateOne({ $inc: { balance: -processingCost } });
          logger.info(
            `Balance deducted by ${processingCost}. Remaining balance: ${
              user.balance - processingCost
            }`
          );
        } else {
          logger.info(
            `NID already exists for nationalId: ${formattedText.nationalId}`
          );
        }

        const pdf = await generatePDF(formattedText, client);
        const mediaNid = new MessageMedia(
          "application/pdf",
          pdf,
          `nid-${formattedText.nationalId}.pdf`
        );

        await msg.reply(mediaNid, undefined, {
          caption: `Processed NID for ${formattedText.nameEnglish}`,
        });
      } catch (error) {
        logger.error("Error during NID processing:", error);
        await msg.reply(
          "An error occurred while processing your request. Please try again."
        );
      }
    } catch (error: any) {
      logger.error("Unexpected error while processing message:", error);
      await msg.reply("An unexpected error occurred. Please try again later.");
    }
  });
}

function getImageBase64(image: Image): string | undefined {
  if (!image?.base64) {
    logger.warn("No image found in the message.");
    return;
  }
  return `data:image/png;base64,${image.base64}`;
}
