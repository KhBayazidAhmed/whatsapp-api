import TelegramBot from "node-telegram-bot-api";
import logger from "../logger.js";

const TELEGRAM_BOT_TOKEN = "7675217366:AAG0OBXVM5ilhPHS_JDnP0Tq0XWBBBKo6gY"; // Replace with your Telegram bot token
const TELEGRAM_CHAT_ID = "-4789543919"; // Replace with your chat ID

// Function to send message to Telegram
export default async function sendMessageToTelegram(
  message: string
): Promise<void> {
  const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: false }); // Polling is unnecessary for this

  // Log that the message is being sent

  try {
    await bot.sendMessage(TELEGRAM_CHAT_ID, `test-${message}`);
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
