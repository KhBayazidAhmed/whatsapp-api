import TelegramBot from "node-telegram-bot-api";
import logger from "../logger.js";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID; // Replace with your chat ID

if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
  console.error(
    "Please set the TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID environment variables."
  );
  process.exit(1);
}
// Function to send message to Telegram
export default async function sendMessageToTelegram(
  message: string
): Promise<void> {
  const bot = new TelegramBot(TELEGRAM_BOT_TOKEN!, { polling: false }); // Polling is unnecessary for this

  // Log that the message is being sent

  try {
    await bot.sendMessage(TELEGRAM_CHAT_ID!, message);
    // Log success message
    logger.info("[Telegram] Message sent successfully!");
  } catch (error) {
    // Log the error
    logger.error("[Telegram] Error sending message: ", error);
    console.error("[Telegram] Error sending message:", error); // Optionally, you can still print to the console
  } finally {
    bot.stopPolling();
  }
}
