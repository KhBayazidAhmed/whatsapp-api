import pkg from "whatsapp-web.js";
const { Client, LocalAuth } = pkg;

import sendingQrCodeForAuth from "./utils/sendingQrCodeForAuth.js";
import { processTheInComingMessage } from "./controller/processTheInComingMessage.js";

// Initialize the client
const client = new Client({
  puppeteer: { headless: false },
  authStrategy: new LocalAuth({ clientId: "client-two" }),
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

processTheInComingMessage(client);

// Initialize the client
console.log("Initializing Client...");
client.initialize();
