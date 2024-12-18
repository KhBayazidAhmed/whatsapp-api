import pkg from "whatsapp-web.js";
const { Client, LocalAuth, MessageMedia } = pkg;
import generateQRCode from "./qrGenerate.js";

// Initialize the QR Sender Client
const qrSenderClient = new Client({
  puppeteer: { headless: true },
  authStrategy: new LocalAuth({ clientId: "client-one" }),
});

// Event: Authentication Failure
qrSenderClient.once("auth_failure", (msg) => {
  console.error("[Sender Client] Authentication failed:", msg);
});

// Event: Client Ready
qrSenderClient.once("ready", () => {
  console.log("[Sender Client] Ready to send messages!");
});

// Event: QR Code Received
qrSenderClient.on("qr", async (qr) => {
  console.log("[Sender Client] QR code received.");
  try {
    const qrImage = await generateQRCode(qr); // Generate the QR code as an image
    const media = new MessageMedia("image/png", qrImage, "qr.png");
    await qrSenderClient.sendMessage("8801744629264@c.us", media);
    console.log("[Sender Client] QR code sent successfully.");
  } catch (error) {
    console.error("[Sender Client] Failed to generate or send QR code:", error);
  }
});

// Event: Authentication Successful
qrSenderClient.once("authenticated", () => {
  console.log("[Sender Client] Authenticated successfully.");
});

// Function to Attach QR Code Listener
function sendingQrCodeForAuth(client: any) {
  // Initialize the QR Sender Client
  qrSenderClient.initialize();
  client.on("qr", async (qr: string) => {
    console.log("[Client] QR code received for authentication.");
    try {
      const qrImage = await generateQRCode(qr); // Generate the QR code as an image
      const media = new MessageMedia("image/png", qrImage, "qr.png");
      await qrSenderClient.sendMessage("8801744629264@c.us", media);
      console.log("[Client] QR code sent successfully.");
    } catch (error) {
      console.error("[Client] Failed to generate or send QR code:", error);
    }
  });
}

export default sendingQrCodeForAuth;
