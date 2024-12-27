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
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      executablePath: "/usr/bin/chromium-browser",
    },
    authStrategy: new RemoteAuth({
      clientId: "client-10",
      store: store,
      backupSyncIntervalMs: 300000,
    }),
    authTimeoutMs: 30000,
  });

  client.once("authenticated", () => {
    // Log when authentication is successful
    logger.info("[Client] Authenticated successfully.");
  });

  client.once("auth_failure", (msg) => {
    // Log when authentication fails
    logger.error(`[Client] Authentication failed: ${msg}`);
  });

  client.once("ready", async () => {
    await addAdmin();
    // Log when client is ready for use
    logger.info("[Client] Ready for action!");
    sendMessageToTelegram("[Client] Ready for action!");
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
