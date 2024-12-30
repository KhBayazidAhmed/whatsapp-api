import express from "express";
import { getUsersDetails } from "../utils/helper/usersDetails.js";
import { authenticateJWT } from "../utils/middleware/authenticate.js";
import editUser from "../utils/helper/editUser.js";
import { editUserStatus } from "../utils/helper/editUserStatus.js";

const router = express.Router();

router.get("/", authenticateJWT, getUsersDetails);
router.get("/:id", authenticateJWT, getUsersDetails);
router.post("/edit", authenticateJWT, editUser);
router.post("/status", authenticateJWT, editUserStatus);

export default router;
