import express from "express";
import { createUser } from "../utils/helper/createUser.js";
import { login } from "../utils/helper/login.js";
import { authenticateJWT } from "../utils/middleware/authenticate.js";

const router = express.Router();

router.post("/create-user", authenticateJWT, createUser);
router.post("/login", login);

export default router;
