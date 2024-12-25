import { Client, Message } from "whatsapp-web.js";
import pkg from "whatsapp-web.js";
const { MessageMedia } = pkg;
import extractTextFromBase64 from "../utils/extractTextFromPdfWithPython.js";
import formatTheString from "../utils/formatTheString.js";
import generatePDF from "../utils/generateTheNid.js";
import NIDData from "../db/nid.model.js";
import { User } from "../db/user.model.js";
import getAddressString from "../utils/helper/makingAddress.js";

interface ApiResponse {
  text: string;
}

export function processTheInComingMessage(client: Client) {
  client.on("message", async (msg: Message) => {
    try {
      console.log("Received a new message from", msg.from);

      if (!msg.hasMedia) {
        console.log("No media found in the message.");
        return;
      }

      console.log("Message has media, proceeding to download...");

      // Fetch user by WhatsApp number
      const user = await User.findOne({ whatsAppNumber: msg.from }).exec();
      if (!user) {
        await msg.reply("User not found.");
        return;
      }

      // Check if user has sufficient balance
      const processingCost = user.price || 5;
      if (user.balance < processingCost) {
        await msg.reply(
          `Insufficient balance. Your current balance is ${user.balance}. Please recharge to continue.`
        );
        return;
      }

      const media = await msg.downloadMedia();

      if (!media || media.mimetype !== "application/pdf") {
        await msg.reply("This is not a valid PDF file.");
        console.log("Received non-PDF media.");
        return;
      }

      console.log("PDF file detected, extracting text from the PDF...");
      const extractedText: ApiResponse = await extractTextFromBase64(
        media.data
      );

      if (!extractedText || !extractedText.text) {
        await msg.reply("Failed to extract text from the PDF.");
        return;
      }

      const formattedText = formatTheString(extractedText.text);

      // Validate extracted NID data
      if (
        !formattedText.nationalId ||
        !formattedText.nameBangla ||
        !formattedText.nameEnglish ||
        !formattedText.dateOfBirth ||
        !formattedText.birthPlace ||
        !formattedText.fatherName ||
        !formattedText.motherName
      ) {
        await msg.reply("This is not a valid NID PDF file.");
        return;
      }

      try {
        const addressObject =
          formattedText.voterAt === "present"
            ? formattedText.presentAddress
            : formattedText.permanentAddress;
        const addressString = getAddressString(addressObject);
        formattedText.nidAddress = addressString;

        // Save NID data to the database
        const nid = await NIDData.create({
          ...formattedText,
          user: user._id,
        });
        console.log("Data saved to database with ID:", nid._id);

        // Deduct the balance
        await user.updateOne({ $inc: { balance: -processingCost } });
        console.log(
          `Balance deducted by ${processingCost}. Remaining balance: ${
            user.balance - processingCost
          }`
        );

        // Generate PDF and send it back
        const pdf = await generatePDF(formattedText, client, media, nid._id);
        const mediaNid = new MessageMedia(
          "application/pdf",
          pdf,
          `nid-${formattedText.nationalId}.pdf`
        );

        await msg.reply(mediaNid, undefined, {
          caption: formattedText.nameEnglish,
        });
      } catch (error) {
        console.error("Error saving to database or sending response:", error);
        await msg.reply("An error occurred while processing your request.");
      }
    } catch (error: any) {
      console.error(
        "Unexpected error while processing message:",
        error.message
      );
      await msg.reply("An error occurred while processing the message.");
    }
  });
}
