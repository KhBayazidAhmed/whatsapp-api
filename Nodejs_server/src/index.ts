import pkg from "whatsapp-web.js";
const { Client, RemoteAuth } = pkg;
import { MongoStore } from "wwebjs-mongo";
import mongoose from "mongoose";
import sendingQrCodeForAuth from "./utils/sendingQrCodeForAuth.js";
import { processTheInComingMessage } from "./controller/processTheInComingMessage.js";
import qrcode from "qrcode-terminal";
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("Please define the MONGODB_URI environment variable ");
  process.exit(1);
}
// Connect to MongoDB
mongoose.connect(MONGODB_URI).then(() => {
  const store = new MongoStore({ mongoose: mongoose });
  const client = new Client({
    puppeteer: {
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    },
    authStrategy: new RemoteAuth({
      clientId: "client-id",
      store: store,
      backupSyncIntervalMs: 300000,
    }),
  });

  // Event: Authentication Successful
  client.once("authenticated", () => {
    console.log("[Client] Authenticated successfully.");
  });

  // Event: Authentication Failure
  client.once("auth_failure", (msg) => {
    console.error("[Client] Authentication failed:", msg);
    console.log("[Client] Attempting to send QR code...");
    sendingQrCodeForAuth(client);
  });

  // Event: Client Ready
  client.once("ready", () => {
    console.log("[Client] Ready for action!");
  });

  // Event: QR Code received
  client.on("qr", (qr) => {
    console.log("[Client] QR Received:");
    qrcode.generate(qr, { small: true }); // Display the QR code in the terminal
    // sendingQrCodeForAuth(client); // Uncomment if you want to send the QR code somewhere
  });

  // Process incoming messages
  processTheInComingMessage(client);

  // Initialize the client
  console.log("Initializing Client...");
  client.initialize();
});
