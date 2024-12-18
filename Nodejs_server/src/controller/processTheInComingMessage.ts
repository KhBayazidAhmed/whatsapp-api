import { Client, Message } from "whatsapp-web.js";
import pkg from "whatsapp-web.js";
const { MessageMedia } = pkg;
import extractTextFromBase64 from "../utils/extractTextFromPdfWithPython.js";
import formatTheString from "../utils/formatTheString.js";
import generatePDF from "../utils/generateTheNid.js";

interface ApiResponse {
  text: string;
}

let count = 0;

export function processTheInComingMessage(client: Client) {
  // Fix type for client
  client.on("message", async (msg: Message) => {
    // Fix type for message
    try {
      console.log("Received a new message", msg.from); // Log the received message

      if (msg.hasMedia) {
        console.log("Message has media, proceeding to download...");

        // Check if user has permission to process media
        const media = await msg.downloadMedia();

        if (media.mimetype === "application/pdf") {
          console.log("PDF file detected, extracting text from the PDF...");

          // Extracting the text from the pdf base64
          const extractedText = (await extractTextFromBase64(
            media.data
          )) as ApiResponse;

          const formattedText = formatTheString(extractedText.text);
          console.log("Sending number of reply...", count);
          count++;

          if (!formattedText.nationalId) {
            await msg.reply("No National ID found in the document");
          }

          const pdf = await generatePDF(formattedText, client, media);
          const mediaNid = new MessageMedia(
            "application/pdf",
            pdf,
            `nid-${formattedText.nationalId}.pdf`
          );
          await msg.reply(mediaNid);
          console.log("Reply sent with formatted text"); // Log that the reply has been sent
        } else {
          await msg.reply("This is not a PDF file");
          console.log("Received non-PDF media, sent a response message.");
        }
      } else {
        console.log("No media found in the message.");
      }
    } catch (error: any) {
      console.error("Error processing message:", error.message);
      msg.reply("An error occurred while processing the message.");
      console.error("Error details:", error.Message); // Log the complete error details
    }
  });
}
