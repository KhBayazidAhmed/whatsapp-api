import TelegramBot from "node-telegram-bot-api";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID; // Replace with your chat ID

if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
  console.error(
    "Please set the TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID environment variables."
  );
  process.exit(1);
}
// Function to send QR code to Telegram
export async function sendQrToTelegram(buffer: Buffer): Promise<void> {
  const bot = new TelegramBot(TELEGRAM_BOT_TOKEN!, { polling: false }); // Polling is unnecessary for this
  try {
    await bot.sendPhoto(TELEGRAM_CHAT_ID!, buffer, {
      caption: "QR Code of text whatsapp",
    });
    console.log("[Telegram] QR code sent successfully!");
  } catch (error) {
    console.error("[Telegram] Error sending QR code:", error);
  } finally {
    bot.stopPolling();
  }
}
