import express from "express";
import { authenticateJWT } from "../utils/middleware/authenticate.js";
import { addBalance } from "../utils/helper/addBalance.js";

const router = express.Router();

router.post("/add-balance", addBalance);

export default router;
