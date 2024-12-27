import express from "express";
import { getUsersDetails } from "../utils/helper/usersDetails.js";
import { authenticateJWT } from "../utils/middleware/authenticate.js";
import editUser from "../utils/helper/editUser.js";

const router = express.Router();

router.get("/", authenticateJWT, getUsersDetails);
router.get("/:id", authenticateJWT, getUsersDetails);
router.post("/edit", authenticateJWT, editUser);

export default router;
