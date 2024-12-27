import express from "express";
import getAllLogs from "../utils/helper/getAllLogs.js";
import { authenticateJWT } from "../utils/middleware/authenticate.js";
const router = express.Router();
router.get("/", authenticateJWT, getAllLogs);
export default router;
