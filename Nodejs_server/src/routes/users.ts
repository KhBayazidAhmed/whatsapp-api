import express from "express";
import { getUsersDetails } from "../utils/helper/usersDetails.js";
import { authenticateJWT } from "../utils/middleware/authenticate.js";
import editUser from "../utils/helper/editUser.js";

const router = express.Router();

router.get("/", getUsersDetails);
router.get("/:id", getUsersDetails);
router.post("/edit", editUser);

export default router;
