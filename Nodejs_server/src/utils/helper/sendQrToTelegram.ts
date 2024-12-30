import TelegramBot from "node-telegram-bot-api";

const TELEGRAM_BOT_TOKEN = "8124074131:AAGVczQy5ChuyLUG6sikkbcsPxwAQyJzcUM"; // Replace with your Telegram bot token
const TELEGRAM_CHAT_ID = "-4618208764"; // Replace with your chat ID

// Function to send QR code to Telegram
export async function sendQrToTelegram(buffer: Buffer): Promise<void> {
  const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: false }); // Polling is unnecessary for this
  try {
    await bot.sendPhoto(TELEGRAM_CHAT_ID, buffer, {
      caption: "QR Code of text whatsapp",
    });
    console.log("[Telegram] QR code sent successfully!");
  } catch (error) {
    console.error("[Telegram] Error sending QR code:", error);
  } finally {
    bot.stopPolling();
  }
}
