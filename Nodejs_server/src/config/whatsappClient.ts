import pkg from "whatsapp-web.js";
import { MongoStore } from "wwebjs-mongo";
import mongoose from "mongoose";
import { toBuffer } from "qrcode";
import { WhatsAppClient } from "../types/index.js";
import { sendQrToTelegram } from "../utils/helper/sendQrToTelegram.js";
import sendMessageToTelegram from "../utils/helper/sendMessageTelegram.js";
import qrcode from "qrcode-terminal";
const { Client, RemoteAuth } = pkg;

export const initializeClient = (
  mongooseInstance: typeof mongoose
): WhatsAppClient => {
  const store = new MongoStore({ mongoose: mongooseInstance });
  const client = new Client({
    puppeteer: { headless: true },
    authStrategy: new RemoteAuth({
      clientId: "client-user-new",
      store: store,
      backupSyncIntervalMs: 300000,
    }),
    authTimeoutMs: 30000,
  });

  client.once("authenticated", () => {
    // sendMessageToTelegram("[Client] Authenticated successfully.");

    console.log("[Client] Authenticated successfully.");
  });
  client.once("auth_failure", (msg) => {
    // sendMessageToTelegram(`[Client] Authentication failed: ${msg}`);
    console.error("[Client] Authentication failed:", msg);
  });
  client.once("ready", () => {
    sendMessageToTelegram("[Client] Ready for action!");
    console.log("[Client] Ready for action!");
  });
  client.on("qr", (qr: string) => {
    console.log("[Client] QR Received:");
    qrcode.generate(qr, { small: true });
    // Generate QR code as a buffer

    // toBuffer(qr, async (err, buffer) => {
    //   if (err) {
    //     console.error("[Client] Error generating QR code buffer:", err);
    //   } else {
    //     console.log("[Client] QR code buffer generated!");
    //     // Send the buffer as an image to Telegram
    //     try {
    //       await sendQrToTelegram(buffer);
    //     } catch (error) {
    //       console.error("[Client] Error sending QR to Telegram:", error);
    //     }
    //   }
    // });
  });
  console.log("client initializing ....");
  client.initialize();

  return client;
};
