import { Router } from "express";
import { sendMessage, getConversationCtrl, getConversationsCtrl, getUnread } from "../controllers/messagesController.js";
import { auth } from "../middleware/auth.js";

const router = Router();

router.post("/", auth, sendMessage);
router.get("/conversations", auth, getConversationsCtrl);
router.get("/unread", auth, getUnread);
router.get("/:userId", auth, getConversationCtrl);

export default router;
