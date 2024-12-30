import TelegramBot from "node-telegram-bot-api";
import logger from "../logger.js";

const TELEGRAM_BOT_TOKEN = "8124074131:AAGVczQy5ChuyLUG6sikkbcsPxwAQyJzcUM"; // Replace with your Telegram bot token
const TELEGRAM_CHAT_ID = "-4618208764"; // Replace with your chat ID

// Function to send message to Telegram
export default async function sendMessageToTelegram(
  message: string
): Promise<void> {
  const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: false }); // Polling is unnecessary for this

  // Log that the message is being sent

  try {
    await bot.sendMessage(TELEGRAM_CHAT_ID, `${message}`);
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
