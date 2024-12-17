import { Client, LocalAuth } from "whatsapp-web.js";
import sendingQrCodeForAuth from "./utils/sendingQrCodeForAuth";
import { processTheInComingMessage } from "./controller/processTheInComingMessage";

// Initialize the client
const client = new Client({
  puppeteer: { headless: true },
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
