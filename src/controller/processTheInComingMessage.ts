import { Client, Message, MessageMedia } from "whatsapp-web.js";
import extractTextFromBase64 from "../utils/extractTextFromPdfWithPython";
import formatTheString from "../utils/formatTheString";

interface ApiResponse {
  text: string;
}
let count = 0;
export function processTheInComingMessage(client: Client) {
  client.on("message", async (message: Message) => {
    try {
      console.log("Received a new message", message.from); // Log the received message

      if (message.hasMedia) {
        console.log("Message has media, proceeding to download...");

        // check user has permission to process media
        const media = await message.downloadMedia();

        if (media.mimetype === "application/pdf") {
          console.log("PDF file detected, extracting text from the PDF...");

          // extracting the text from the pdf base64
          const extractedText = (await extractTextFromBase64(
            media.data
          )) as ApiResponse;

          const formattedText = formatTheString(extractedText.text);
          console.log("Formatted text: done for ", formattedText.nationalId);
          console.log("Sending number of reply...", count);
          count++;
          if (!formattedText.nationalId) {
            await message.reply("No National ID found in the document");
          }
          await message.reply(JSON.stringify(formattedText, null, 2));
          console.log("Reply sent with formatted text"); // Log that the reply has been sent
        } else {
          await message.reply("This is not a PDF file");
          console.log("Received non-PDF media, sent a response message.");
        }
      } else {
        console.log("No media found in the message.");
      }
    } catch (error: any) {
      console.error("Error processing message:", error.message);
      message.reply("An error occurred while processing the message.");
      console.error("Error details:", error); // Log the complete error details
    }
  });
}
