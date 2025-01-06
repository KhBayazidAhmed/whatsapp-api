import express from "express";
import getAllNid from "../utils/helper/getAllNid.js";
// import editNid from "../utils/helper/editNid.js";
import searchByNidNumber from "../utils/helper/searchByNidNumber.js";
import generateNid from "../utils/helper/generateNid.js";
import searchNid from "../utils/helper/searchNid.js";
import { authenticateJWT } from "../utils/middleware/authenticate.js";
const router = express.Router();
router.get("/all-nid", authenticateJWT, getAllNid);
router.get("/search", authenticateJWT, searchNid);
router.get("/search-by-nid-number", authenticateJWT, searchByNidNumber);

router.post("/generateNid", authenticateJWT, generateNid);
export default router;
