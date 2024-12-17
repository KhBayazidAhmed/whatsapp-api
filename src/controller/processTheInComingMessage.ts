import { Client, Message, Chat } from "whatsapp-web.js";

export function processTheInComingMessage(client: Client) {
  client.on("message", async (message: Message) => {
    // Can check if the user is subscribed or not
    console.log("new message from", message.from);
    if (message.body === "hello") {
      await message.reply("Hello, how can I help you?", message.id._serialized);
    }
    // try {
    //   if (message.hasMedia) {
    //     const media = await message.downloadMedia();
    //     if (media.mimetype === "application/pdf") {
    //       // Do something with the PDF

    //       // Reply with a quoted message
    //       await message.reply("This is a PDF file", message.id.id, {
    //         quotedMessageId: message.id._serialized, // Quoting the original message
    //       });
    //     } else {
    //       await message.reply("This is not a PDF file", message.id.id, {
    //         quotedMessageId: message.id._serialized, // Quoting the original message
    //       });
    //     }
    //   }
    // } catch (error: any) {
    //   console.error("Error processing message:", error.message);
    //   message.reply("An error occurred while processing the message.");
    // }
  });
}
