import { Client, Message } from "whatsapp-web.js";
import pkg from "whatsapp-web.js";
const { MessageMedia } = pkg;
import extractTextFromBase64 from "../utils/extractTextFromPdfWithPython.js";
import formatTheString from "../utils/formatTheString.js";
import generatePDF from "../utils/generateTheNid.js";
import NIDData from "../db/nid.model.js";
import { User } from "../db/user.model.js";
import fetchImagesWithRetry from "../utils/helper/fetchImagesWithRetryForImageExtraction.js";

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
      console.log(`Received a new message from ${msg.from}`);

      if (!msg.hasMedia) {
        console.log("No media found in the message.");
        await msg.reply("Please send a valid PDF file for processing.");
        return;
      }

      console.log("Message has media, proceeding to download...");

      const user = await User.findOne({ whatsAppNumber: msg.from }).exec();
      if (!user) {
        console.warn(`User not found for WhatsApp number: ${msg.from}`);
        return;
      }

      const processingCost = user.price || 5;
      if (user.balance < processingCost) {
        console.warn(`Insufficient balance for user: ${msg.from}`);
        await msg.reply(
          `Insufficient balance. Your current balance is ${user.balance}. Please recharge to continue.`
        );
        return;
      }

      const media = await msg.downloadMedia();
      if (!media || media.mimetype !== "application/pdf") {
        console.log("Received non-PDF media.");
        await msg.reply(
          "This is not a valid PDF file. Please send a valid NID PDF."
        );
        return;
      }

      console.log("PDF file detected, extracting text from the PDF...");
      const extractedText: ApiResponse = await extractTextFromBase64(
        media.data
      );

      if (!extractedText?.text) {
        console.error("Failed to extract text from PDF.");
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
        console.warn("Invalid NID PDF format.");
        await msg.reply("This is not a valid NID PDF file.");
        return;
      }

      try {
        console.log("Fetching images from PDF...");
        const images = await fetchImagesWithRetry(media.data);
        if (!images?.images) {
          throw new Error("Failed to fetch sufficient images.");
        }
        formattedText.userImage = getImageBase64(images?.images[0]) as string;
        formattedText.userSign = getImageBase64(images?.images[1]);

        console.log("Checking if NID already exists...");
        const existingNid = await NIDData.findOne({
          nationalId: formattedText.nationalId,
          user: user._id,
        });

        if (!existingNid) {
          console.log("Saving new NID data to database...");
          const nid = await NIDData.create({
            ...formattedText,
            user: user._id,
          });

          console.log(`Data saved with ID: ${nid._id}`);
          await user.updateOne({ $inc: { balance: -processingCost } });
          console.log(
            `Balance deducted by ${processingCost}. Remaining balance: ${
              user.balance - processingCost
            }`
          );
        } else {
          console.log(
            `NID already exists for nationalId: ${formattedText.nationalId}`
          );
        }

        console.log("Generating PDF for the processed NID...");
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
        console.error("Error during NID processing:", error);
        await msg.reply(
          "An error occurred while processing your request. Please try again."
        );
      }
    } catch (error: any) {
      console.error("Unexpected error while processing message:", error);
      await msg.reply("An unexpected error occurred. Please try again later.");
    }
  });
}

function getImageBase64(image: Image): string | undefined {
  if (!image?.base64) {
    console.log("No image found in the message.");
    return;
  }
  return `data:image/png;base64,${image.base64}`;
}
