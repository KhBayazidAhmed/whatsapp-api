import express from "express";
import { authenticateJWT } from "../utils/middleware/authenticate.js";
import { addBalance } from "../utils/helper/addBalance.js";
import { homeAnalytics } from "../utils/helper/homeAnalytics.js";

const router = express.Router();

router.post("/add-balance", authenticateJWT, addBalance);
router.get("/home-analytics", authenticateJWT, homeAnalytics);

export default router;
