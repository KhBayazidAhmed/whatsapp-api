import express from "express";
import { authenticateJWT } from "../utils/middleware/authenticate.js";

const router = express.Router();

router.get("/status", authenticateJWT, (req, res) => {
  res.json({ status: "WhatsApp client is running" });
});

router.get("/qr", authenticateJWT, (req, res) => {
  let qr;
  req.whatsappClient.on("qr", (qr) => {
    qr = qr;
  });
  if (!qr) {
    res.status(404).json({ message: "QR code not found" });
    return;
  }
  res.json({
    qr: qr,
    message: "Scan the QR code to authenticate WhatsApp client",
  });
});

export default router;
