import express from "express";
import getAllNid from "../utils/helper/getAllNid.js";
import editNid from "../utils/helper/editNid.js";
import searchNid from "../utils/helper/searchNid.js";
const router = express.Router();
router.get("/all-nid", getAllNid);
router.post("/edit/:id", editNid);
router.get("/search", searchNid);
export default router;
