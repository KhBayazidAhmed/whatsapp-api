import { Client, Message } from "whatsapp-web.js";
import pkg from "whatsapp-web.js";
const { MessageMedia, MessageTypes } = pkg;
import extractTextFromBase64 from "../utils/extractTextFromPdfWithPython.js";
import formatTheString from "../utils/formatTheString.js";
import generatePDF from "../utils/generateTheNid.js";
import NIDData from "../db/nid.model.js";
import { User } from "../db/user.model.js";
import fetchImagesWithRetry from "../utils/helper/fetchImagesWithRetryForImageExtraction.js";
import logger from "../utils/logger.js";
import { getProfileDetails } from "../utils/helper/profileDetails.js";
import BalanceTransition from "../db/BalanceTransition.model.js";
import rechargeMessage from "../utils/helper/rechargeMessage.js";
import make13Digit from "../utils/helper/make13Digit.js";
import make17Digit from "../utils/helper/make17Digit.js";
const groupId = process.env.GROUP_ID!;
interface ApiResponse {
  text: string;
}

interface Image {
  base64: string;
  filename: string;
}

export default function processTheInComingMessage(client: Client) {
  client.on("message_create", async (msg: Message) => {
    if (msg.fromMe) return;
    try {
      logger.info(`Received a new message from ${msg.from}`);

      if (msg.type === MessageTypes.TEXT) {
        if (msg.body.toLocaleLowerCase() === "/profile") {
          await getProfileDetails(msg);
          return;
        }
        if (msg.body.toLocaleLowerCase() === "/recharge") {
          await rechargeMessage(msg);
          return;
        }

        if (msg.body.toLocaleLowerCase() === "/17") {
          await make17Digit(msg, client);
        }
        if (msg.body.toLocaleLowerCase() === "/13") {
          await make13Digit(msg, client);
        }
        return;
      }
      if (msg.type !== MessageTypes.DOCUMENT) {
        logger.warn(`Invalid message type: ${msg.type}`);
        return;
      }
      // Check if the message has a PDF attachment
      const media = await msg.downloadMedia();
      if (!media || media.mimetype !== "application/pdf") {
        return;
      }

      if (msg.from === groupId) {
        logger.info(`Received a new message from group: ${msg.from}`);
        try {
          const extractedText: ApiResponse = await extractTextFromBase64(
            media.data
          );
          const images = await fetchImagesWithRetry(media.data);

          if (!images) {
            return; // Exit early if no images are found
          }
          const formattedText = formatTheString(extractedText.text);
          // Reply with both extracted text and formatted text in one message to reduce redundancy
          await msg.reply(extractedText.text);
          await msg.reply(JSON.stringify(formattedText, null, 2));
          // Using a for...of loop instead of forEach for async operations
          for (const image of images.images || []) {
            const imageMedia = new MessageMedia(
              MessageTypes.IMAGE,
              image.base64,
              formattedText.nameEnglish
            );
            await msg.reply(imageMedia); // Send each image
          }
        } catch (error) {
          logger.error("Error processing media:", error);
          // Optionally, send an error message back
          await msg.reply("There was an error processing your media.");
        }

        return;
      }

      // Fetch the user atomically to avoid concurrency issues
      const user = await User.findOne({ whatsAppNumber: msg.from }).exec();

      if (!user) {
        logger.warn(`User not found for WhatsApp number: ${msg.from}`);
        return;
      }

      if (!user.isActive) {
        logger.warn(`User is inactive: ${msg.from}`);
        await msg.reply("Your account is inactive. Please activate it.");
        return;
      }

      if (!msg.hasMedia) {
        return;
      }

      const extractedText: ApiResponse = await extractTextFromBase64(
        media.data
      );

      if (!extractedText?.text) {
        logger.error(
          "Failed to extract text from PDF. Please try again." +
            "whatsAppNumber: " +
            msg.from
        );
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
        logger.warn("Invalid NID PDF format." + "whatsAppNumber: " + msg.from);
        await msg.reply("This is not a valid NID PDF file.");
        return;
      }

      // Check if NID already exists
      const existingNid = await NIDData.findOne({
        nationalId: formattedText.nationalId,
        user: user._id,
      });

      if (existingNid) {
        await msg.reply(
          `NID already exists for nationalId: ${formattedText.nationalId}`
        );
        const images = await fetchImagesWithRetry(media.data);
        if (!images?.images) {
          throw new Error("Failed to fetch sufficient images.");
        }
        formattedText.userImage = getImageBase64(images?.images[0]) as string;
        formattedText.userSign = getImageBase64(images?.images[1]);
        const pdf = await generatePDF(formattedText, client);
        const mediaNid = new MessageMedia(
          "application/pdf",
          pdf,
          `nid-${formattedText.nationalId}.pdf`
        );

        await msg.reply(mediaNid, undefined, {
          caption: `Processed NID for ${formattedText.nameEnglish}`,
        });
        logger.info(
          `NID already exists for nationalId: ${formattedText.nationalId} of ${user.whatsAppNumber}`
        );
        return; // Exit to avoid balance deduction
      }

      const processingCost = user.price;

      // Atomic balance check and deduction after NID validation
      const updatedUser = await User.findOneAndUpdate(
        { _id: user._id, balance: { $gte: processingCost } },
        { $inc: { balance: -processingCost } },
        { new: true }
      ).exec();

      if (!updatedUser) {
        logger.warn(`Insufficient balance for user: ${msg.from}`);
        await msg.reply(
          `You have insufficient balance. Your current balance is ${user.balance}. Please recharge your account balance by using the '/recharge' command`
        );
        return;
      }

      try {
        const images = await fetchImagesWithRetry(media.data);
        if (!images?.images) {
          throw new Error("Failed to fetch sufficient images.");
        }
        formattedText.userImage = getImageBase64(images?.images[0]) as string;
        formattedText.userSign = getImageBase64(images?.images[1]);

        await NIDData.create({
          ...formattedText,
          user: user._id,
          price: processingCost,
        });
        await BalanceTransition.create({
          userId: user._id,
          amount: processingCost,
          type: "debit",
          balanceAfter: updatedUser.balance,
        });

        logger.info(
          `Balance deducted by ${processingCost}. Remaining balance: ${updatedUser.balance} of ${user.whatsAppNumber}`
        );

        const pdf = await generatePDF(formattedText, client);
        const mediaNid = new MessageMedia(
          "application/pdf",
          pdf,
          `nid-${formattedText.nationalId}.pdf`
        );

        await msg.reply(mediaNid, undefined, {
          caption: `Processed NID for ${formattedText.nameEnglish}  ${updatedUser.balance}`,
        });

        logger.info(
          `NID processed for nationalId: ${formattedText.nationalId} of ${user.whatsAppNumber}`
        );
      } catch (error) {
        logger.error(
          "Error during NID processing:",
          error + "whatsAppNumber: " + msg.from
        );
        await msg.reply(
          "An error occurred while processing your request. Please try again."
        );
      }
    } catch (error: any) {
      logger.error(
        "Unexpected error while processing message:",
        error + "whatsAppNumber: " + msg.from
      );
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
