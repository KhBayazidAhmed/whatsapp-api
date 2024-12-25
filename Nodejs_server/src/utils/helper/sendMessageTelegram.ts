import TelegramBot from "node-telegram-bot-api";

const TELEGRAM_BOT_TOKEN = "7675217366:AAG0OBXVM5ilhPHS_JDnP0Tq0XWBBBKo6gY"; // Replace with your Telegram bot token
const TELEGRAM_CHAT_ID = "-4789543919"; // Replace with your chat ID

// Function to send message by  to Telegram
export default async function sendMessageToTelegram(
  message: string
): Promise<void> {
  const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: false }); // Polling is unnecessary for this
  try {
    await bot.sendMessage(TELEGRAM_CHAT_ID, message);
    console.log("[Telegram]  sent successfully!");
  } catch (error) {
    console.error("[Telegram] Error sending message:", error);
  } finally {
    bot.stopPolling();
  }
}
