import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { getMessage, getUsers, sendMessage } from "../controllers/message.controller.js";

const router = express.Router();

router.get("/conversations", protectRoute, getUsers)
router.get("/:id", protectRoute, getMessage)
router.post("/send/:id", protectRoute, sendMessage)


export default router;