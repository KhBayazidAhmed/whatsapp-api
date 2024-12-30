import pkg from "whatsapp-web.js";
import { MongoStore } from "wwebjs-mongo";
import mongoose from "mongoose";
import { toBuffer } from "qrcode";
import { WhatsAppClient } from "../types/index.js";
import { sendQrToTelegram } from "../utils/helper/sendQrToTelegram.js";
import sendMessageToTelegram from "../utils/helper/sendMessageTelegram.js";
import qrcode from "qrcode-terminal";
import logger from "../utils/logger.js";
import addAdmin from "../utils/helper/addAdmin.js";

const { Client, RemoteAuth } = pkg;

export const initializeClient = (
  mongooseInstance: typeof mongoose
): WhatsAppClient => {
  const store = new MongoStore({ mongoose: mongooseInstance });
  const client = new Client({
    puppeteer: {
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-infobars",
        "--disable-gpu",
      ],
      executablePath: "/usr/bin/chromium-browser",
      // dumpio: true,
    },
    authStrategy: new RemoteAuth({
      clientId: "client-10",
      store: store,
      backupSyncIntervalMs: 300000,
    }),
    authTimeoutMs: 300000,
  });

  client.once("authenticated", () => {
    // Log when authentication is successful
    sendMessageToTelegram("[Client] Authenticated successfully!");
    logger.info("[Client] Authenticated successfully.");
  });
  client.on("loading_screen", () => {
    sendMessageToTelegram("[Client] Loading screen displayed.");
    // Log when the loading screen is displayed
    logger.info("[Client] Loading screen displayed.");
  });
  client.on("disconnected", (reason) => {
    sendMessageToTelegram(`[Client] Disconnected: ${reason}`);
    // Log when the client is disconnected
    logger.info(`[Client] Disconnected: ${reason}`);
  });
  client.on("remote_session_saved", () => {
    sendMessageToTelegram("[Client] Remote session saved.");
    // Log when a remote session is saved
    logger.info("[Client] Remote session saved.");
  });
  client.once("auth_failure", (msg) => {
    sendMessageToTelegram(`[Client] Authentication failed: ${msg}`);
    // Log when authentication fails
    logger.error(`[Client] Authentication failed: ${msg}`);
  });

  client.once("ready", async () => {
    await addAdmin();
    // Log when client is ready for use
    logger.info("[Client] Ready for action!");
    // sendMessageToTelegram("[Client] Ready for action!");
  });

  client.on("qr", (qr: string) => {
    // Log when QR code is received
    qrcode.generate(qr, { small: true });
    // Optionally send QR code to Telegram, but only log errors if something goes wrong
    toBuffer(qr, async (err, buffer) => {
      if (err) {
        logger.error("[Client] Error generating QR code buffer:", err);
      } else {
        try {
          await sendQrToTelegram(buffer);
        } catch (error) {
          logger.error("[Client] Error sending QR to Telegram:", error);
        }
      }
    });
  });

  // Log client initialization
  logger.info("[Client] Initializing...");
  client.initialize();

  return client;
};
