import { Client, Message } from "whatsapp-web.js";
import extractTextFromBase64 from "../utils/extractTextFromPdfWithPython";
export function processTheInComingMessage(client: Client) {
  client.on("message", async (message: Message) => {
    try {
      if (message.hasMedia) {
        // check user has permission to process media
        const media = await message.downloadMedia();
        if (media.mimetype === "application/pdf") {
          // extracting the text from the pdf base64
          const extractedText = await extractTextFromBase64(media.data);
          console.log(extractedText);
        } else {
          await message.reply("This is not a PDF file");
        }
      }
    } catch (error: any) {
      console.error("Error processing message:", error.message);
      message.reply("An error occurred while processing the message.");
    }
  });
}
